import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { UserService } from '../user/user.service';
import { MailService } from '../common/mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto, UpdateOrderStatusDto, UpdateShippingDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-response.dto';
import { OrderMapper } from './mappers/order.mapper';
import { OrderStatus, CANCELLABLE_STATUSES, FINAL_STATUSES } from './enums/order-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto): Promise<OrderResponseDto> {
    const session = await this.orderModel.db.startSession();
    session.startTransaction();

    try {
      const cart = await this.cartModel
        .findOne({ user: userId })
        .populate('items.product')
        .session(session)
        .exec();

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('El carrito está vacío');
      }

      const orderItems: OrderDocument['items'] = [];
      let subtotal = 0;
      let totalDiscount = 0;

      for (const cartItem of cart.items) {
        const product = cartItem.product as unknown as ProductDocument;

        if (!product) {
          throw new BadRequestException('Producto no encontrado en el carrito');
        }

        if (!product.status) {
          throw new BadRequestException(`El producto "${product.name}" ya no está disponible`);
        }

        if (cartItem.variant?.size) {
          const size = product.sizes.find((s) => s.size === cartItem.variant?.size?.toUpperCase());
          const availableStock = size ? size.stock - (size.reserved ?? 0) : 0;

          if (availableStock < cartItem.quantity) {
            throw new ConflictException(
              `Stock insuficiente para "${product.name}" talle ${cartItem.variant.size}. ` +
                `Disponible: ${availableStock}, solicitado: ${cartItem.quantity}`,
            );
          }
        }

        const discount = product.discount ?? 0;
        const unitPrice = product.price - product.price * (discount / 100);
        const itemSubtotal = unitPrice * cartItem.quantity;
        const itemDiscount = product.price * cartItem.quantity - itemSubtotal;

        subtotal += itemSubtotal;
        totalDiscount += itemDiscount;

        orderItems.push({
          product: new Types.ObjectId(product._id),
          name: product.name,
          code: product.code,
          variant: cartItem.variant,
          quantity: cartItem.quantity,
          unitPrice,
          discount,
          subtotal: itemSubtotal,
          image: product.images?.[0],
        });
      }

      const shippingCost = this.calculateShipping(subtotal);
      const total = subtotal + shippingCost;

      const newOrder = new this.orderModel({
        user: new Types.ObjectId(userId),
        items: orderItems,
        subtotal,
        discount: totalDiscount,
        shippingCost,
        total,
        status: OrderStatus.PENDING,
        paymentMethod: dto.paymentMethod,
        shippingAddress: {
          ...dto.shippingAddress,
          country: dto.shippingAddress.country || 'Argentina',
        },
        notes: dto.notes,
      });

      await newOrder.save({ session });

      for (const item of cart.items) {
        if (item.variant?.size) {
          const result = await this.productModel.findOneAndUpdate(
            {
              _id: item.product,
              'sizes.size': item.variant.size.toUpperCase(),
            },
            {
              $inc: {
                'sizes.$.stock': -item.quantity,
                'sizes.$.reserved': -item.quantity,
                salesCount: item.quantity,
              },
            },
            { session, new: true },
          );

          if (!result) {
            throw new ConflictException(
              `No se pudo actualizar el stock. Stock insuficiente para el producto.`,
            );
          }
        }
      }

      cart.items = [];
      await cart.save({ session });

      await session.commitTransaction();

      try {
        await this.userService.incrementOrders(userId, 1);
      } catch (error) {
        if (this.configService.get('NODE_ENV') !== 'production') {
          console.warn(`No se pudo incrementar contador de órdenes para ${userId}`, error);
        }
      }

      return OrderMapper.toOrderResponseDto(newOrder);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getMyOrders(userId: string, query: OrderQueryDto): Promise<PaginatedOrderResponseDto> {
    const { page = 1, limit = 10, status, paymentMethod, startDate, endDate } = query;

    const filter: {
      user?: string;
      status?: OrderStatus;
      paymentMethod?: PaymentMethod;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {};

    if (status) {
      filter.status = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      orders: orders.map((order) => OrderMapper.toOrderResponseDto(order)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderById(orderId: string, userId: string, isAdmin = false): Promise<OrderResponseDto> {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (!isAdmin && order.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta orden');
    }

    return OrderMapper.toOrderResponseDto(order, isAdmin);
  }

  async cancelOrder(
    orderId: string,
    userId: string,
    dto: CancelOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (order.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta orden');
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException('Esta orden no puede ser cancelada en su estado actual');
    }

    if (order.paymentDetails?.status === 'paid' || order.paymentDetails?.status === 'delivered') {
      throw new BadRequestException(
        'Esta orden tiene un pago aprobado. Para cancelarla, contacta con soporte para iniciar el reembolso.',
      );
    }

    for (const item of order.items) {
      if (item.variant?.size) {
        await this.productModel.findOneAndUpdate(
          {
            _id: item.product,
            'sizes.size': item.variant.size.toUpperCase(),
          },
          {
            $inc: {
              'sizes.$.stock': item.quantity,
              salesCount: -item.quantity,
            },
          },
        );
      }
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancellationReason = dto.reason;
    await order.save();

    const user = await this.userService.findById(userId);
    if (user) {
      await this.mailService.sendOrderCancellation(user.email, order.orderNumber);
    }

    return OrderMapper.toOrderResponseDto(order);
  }

  async cancelExpiredOrders(params: { status: OrderStatus; minutes: number }): Promise<number> {
    const expirationDate = new Date(Date.now() - params.minutes * 60 * 1000);

    const expiredOrders = await this.orderModel.find({
      status: params.status,
      createdAt: { $lte: expirationDate },
    });

    for (const order of expiredOrders) {
      for (const item of order.items) {
        if (item.variant?.size) {
          await this.productModel.findOneAndUpdate(
            {
              _id: item.product,
              'sizes.size': item.variant.size.toUpperCase(),
            },
            {
              $inc: {
                'sizes.$.stock': item.quantity,
                'sizes.$.reserved': item.quantity,
              },
            },
          );
        }
      }

      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = new Date();
      order.cancellationReason = 'Tiempo de pago expirado';

      order.statusHistory.push({
        status: OrderStatus.CANCELLED,
        timestamp: new Date(),
      });

      await order.save();
    }

    return expiredOrders.length;
  }

  async getAllOrders(query: OrderQueryDto): Promise<PaginatedOrderResponseDto> {
    const { page = 1, limit = 10, status, paymentMethod, startDate, endDate, userId } = query;

    const filter: {
      user?: string;
      status?: OrderStatus;
      paymentMethod?: PaymentMethod;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {};

    if (userId) {
      filter.user = userId;
    }

    if (status) {
      filter.status = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      orders: orders.map((order) => OrderMapper.toOrderResponseDto(order, true)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateOrderStatus(
    orderId: string,
    adminId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (FINAL_STATUSES.includes(order.status)) {
      throw new BadRequestException('No se puede modificar una orden en estado final');
    }

    order.status = dto.status;

    order.statusHistory.push({
      status: dto.status,
      timestamp: new Date(),
      note: dto.note,
      updatedBy: new Types.ObjectId(adminId),
    });

    if (dto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    await order.save();

    const user = await this.userService.findById(order.user.toString());
    if (user) {
      if (dto.status === OrderStatus.SHIPPED) {
        await this.mailService.sendOrderShipped(
          user.email,
          order.orderNumber,
          order.trackingNumber,
        );
      } else if (dto.status === OrderStatus.DELIVERED) {
        await this.mailService.sendOrderDelivered(user.email, order.orderNumber);
      }
    }

    return OrderMapper.toOrderResponseDto(order, true);
  }

  async updateShippingInfo(orderId: string, dto: UpdateShippingDto): Promise<OrderResponseDto> {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (dto.trackingNumber !== undefined) {
      order.trackingNumber = dto.trackingNumber;
    }

    if (dto.estimatedDelivery !== undefined) {
      order.estimatedDelivery = new Date(dto.estimatedDelivery);
    }

    if (dto.adminNotes !== undefined) {
      order.adminNotes = dto.adminNotes;
    }

    await order.save();

    return OrderMapper.toOrderResponseDto(order, true);
  }

  async markEmailSentIfNotSent(orderId: string): Promise<boolean> {
    const result = await this.orderModel.findOneAndUpdate(
      {
        _id: orderId,
        emailSent: false,
      },
      {
        $set: { emailSent: true },
      },
      { new: true },
    );

    return !!result;
  }

  async findById(orderId: string): Promise<OrderDocument | null> {
    return this.orderModel.findById(orderId).exec();
  }

  private calculateShipping(subtotal: number): number {
    if (subtotal >= 50000) {
      return 0;
    }
    return 5000;
  }
}
