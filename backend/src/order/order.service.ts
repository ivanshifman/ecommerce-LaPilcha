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
import { ShippingCalculatorService } from '../shipping/shipping-calculator.service';
import { CouponService } from '../coupon/coupon.service';
import { StockService } from '../cart/stock.service';
import { UserService } from '../user/user.service';
import { MailService } from '../common/mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto, UpdateOrderStatusDto, UpdateShippingDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-response.dto';
import { OrderMapper } from './mappers/order.mapper';
import { OrderStatus, CANCELLABLE_STATUSES, FINAL_STATUSES } from './enums/order-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';
import { ShippingMethod } from '../shipping/enums/shipping.enum';
import { CouponType } from '../coupon/enums/coupon-type.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly configService: ConfigService,
    private readonly couponService: CouponService,
    private readonly mailService: MailService,
    private readonly shippingCalculatorService: ShippingCalculatorService,
    private readonly stockService: StockService,
    private readonly userService: UserService,
  ) {}

  async createOrder(
    dto: CreateOrderDto,
    userId?: string,
    anonymousCartId?: string,
  ): Promise<OrderResponseDto> {
    const session = await this.orderModel.db.startSession();
    session.startTransaction();

    try {
      if (!userId && !dto.guestInfo) {
        throw new BadRequestException(
          'Debes proporcionar información de contacto o iniciar sesión',
        );
      }

      if (userId && dto.guestInfo) {
        throw new BadRequestException(
          'No puedes proporcionar información de contacto si estás logueado',
        );
      }

      const query = userId ? { user: userId } : { anonymousId: anonymousCartId };
      const cart = await this.cartModel
        .findOne(query)
        .populate('items.product')
        .session(session)
        .exec();

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('El carrito está vacío');
      }

      const orderItems: OrderDocument['items'] = [];
      let subtotal = 0;
      let totalDiscount = 0;
      let totalWeight = 0;

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

        let productWeight = 0.3;

        if (product.weight && product.weight > 0) {
          productWeight = product.weight;
        }

        totalWeight += productWeight * cartItem.quantity;

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

      let shippingCost = 0;
      let couponDiscount = 0;
      let freeShippingFromCoupon = false;
      let couponApplied: OrderDocument['couponApplied'];

      if (dto.couponCode) {
        const cartCategories = Array.from(
          new Set(
            cart.items.map((item) => {
              const prod = item.product as unknown as ProductDocument;
              return prod.category;
            }),
          ),
        );

        const cartProducts = cart.items.map((item) => item.product.toString());

        const validation = await this.couponService.validateCoupon({
          code: dto.couponCode,
          orderTotal: subtotal,
          userId,
          guestEmail: dto.guestInfo?.email,
          cartCategories,
          cartProducts,
        });

        if (!validation.valid) {
          throw new BadRequestException(validation.message || 'Cupón no válido');
        }

        if (validation.coupon) {
          couponDiscount = validation.discountAmount;
          freeShippingFromCoupon = validation.coupon.type === CouponType.FREE_SHIPPING;

          couponApplied = {
            code: validation.coupon.code,
            couponType: validation.coupon.type,
            discountAmount: couponDiscount,
            freeShipping: freeShippingFromCoupon,
          };
        }
      }

      if (dto.shippingMethod !== ShippingMethod.PICKUP && !freeShippingFromCoupon) {
        try {
          shippingCost = await this.shippingCalculatorService.getShippingCost(
            dto.shippingAddress.state,
            dto.shippingMethod || ShippingMethod.STANDARD,
            subtotal,
            totalWeight,
          );
        } catch {
          shippingCost = this.calculateShippingFallback(subtotal);
        }
      }

      const total = subtotal - couponDiscount + shippingCost;

      if (total < 0) {
        throw new BadRequestException('El total de la orden no puede ser negativo');
      }

      const newOrder = new this.orderModel({
        user: userId ? new Types.ObjectId(userId) : undefined,
        guestInfo: userId ? undefined : dto.guestInfo,
        items: orderItems,
        subtotal,
        discount: totalDiscount,
        shippingCost,
        totalWeight,
        total,
        status: OrderStatus.PENDING,
        paymentMethod: dto.paymentMethod,
        shippingMethod: dto.shippingMethod || ShippingMethod.STANDARD,
        shippingAddress: {
          ...dto.shippingAddress,
          country: dto.shippingAddress.country || 'Argentina',
        },
        notes: dto.notes,
        isGuest: !userId,
        couponApplied,
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

      if (dto.couponCode && couponDiscount > 0) {
        try {
          await this.couponService.applyCoupon(
            dto.couponCode,
            newOrder._id.toString(),
            userId,
            dto.guestInfo?.email,
            couponDiscount,
            subtotal,
          );
        } catch (error) {
          console.error('Error registrando uso de cupón:', error);
        }
      }

      if (userId) {
        try {
          await this.userService.incrementOrders(userId, 1);
        } catch (error) {
          if (this.configService.get('NODE_ENV') !== 'production') {
            console.warn(`No se pudo incrementar contador de órdenes para ${userId}`, error);
          }
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
      user?: Types.ObjectId;
      status?: OrderStatus;
      paymentMethod?: PaymentMethod;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {
      user: new Types.ObjectId(userId),
    };

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

  async getOrderById(orderId: string, userId?: string, isAdmin = false): Promise<OrderResponseDto> {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (!isAdmin && userId && order.user && order.user.toString() !== userId) {
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

    if (order.user && order.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta orden');
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException('Esta orden no puede ser cancelada en su estado actual');
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
    const email = order.user ? (user?.email ?? null) : this.getOrderEmail(order);

    if (email) {
      await this.mailService.sendOrderCancellation(email, order.orderNumber);
    }

    return OrderMapper.toOrderResponseDto(order);
  }

  async cancelExpiredOrders(params: { status: OrderStatus; minutes: number }): Promise<number> {
    const expirationDate = new Date(Date.now() - params.minutes * 60 * 1000);

    const expiredOrders = await this.orderModel
      .find({
        status: params.status,
        createdAt: { $lte: expirationDate },
      })
      .session(await this.orderModel.startSession());

    const session = await this.orderModel.db.startSession();
    session.startTransaction();

    try {
      let cancelledCount = 0;

      for (const order of expiredOrders) {
        const currentOrder = await this.orderModel
          .findOne({ _id: order._id, status: params.status })
          .session(session);

        if (!currentOrder) continue;

        for (const item of currentOrder.items) {
          if (item.variant?.size) {
            await this.productModel.findOneAndUpdate(
              {
                _id: item.product,
                'sizes.size': item.variant.size.toUpperCase(),
              },
              {
                $inc: {
                  'sizes.$.stock': item.quantity,
                  'sizes.$.reserved': -item.quantity,
                  salesCount: -item.quantity,
                },
              },
              { session },
            );
          }
        }

        currentOrder.status = OrderStatus.CANCELLED;
        currentOrder.cancelledAt = new Date();
        currentOrder.cancellationReason = 'Tiempo de pago expirado';
        currentOrder.statusHistory.push({
          status: OrderStatus.CANCELLED,
          timestamp: new Date(),
          note: 'Cancelado automáticamente por timeout',
        });

        await currentOrder.save({ session });
        cancelledCount++;
      }

      await session.commitTransaction();
      return cancelledCount;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getAllOrders(query: OrderQueryDto): Promise<PaginatedOrderResponseDto> {
    const { page = 1, limit = 10, status, paymentMethod, startDate, endDate, userId } = query;

    const filter: {
      user?: Types.ObjectId;
      status?: OrderStatus;
      paymentMethod?: PaymentMethod;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {};

    if (userId) {
      filter.user = new Types.ObjectId(userId);
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

    let email: string | null = null;
    if (order.user) {
      const user = await this.userService.findById(order.user.toString());
      email = user?.email ?? null;
    } else {
      email = this.getOrderEmail(order);
    }

    if (email) {
      if (dto.status === OrderStatus.SHIPPED) {
        await this.mailService.sendOrderShipped(email, order.orderNumber, order.trackingNumber);
      } else if (dto.status === OrderStatus.DELIVERED) {
        await this.mailService.sendOrderDelivered(email, order.orderNumber);
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

  async confirmProductReturn(orderId: string): Promise<OrderResponseDto> {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.status !== OrderStatus.REFUND_PENDING) {
      throw new BadRequestException('La orden no está pendiente de devolución');
    }

    for (const item of order.items) {
      if (item.variant?.size) {
        await this.stockService.releaseStock(
          item.product.toString(),
          item.variant.size,
          item.quantity,
        );
      }
    }

    order.status = OrderStatus.REFUNDED;
    order.statusHistory.push({
      status: OrderStatus.REFUNDED,
      timestamp: new Date(),
      note: 'Producto devuelto físicamente. Stock restaurado.',
    });
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

  getOrderEmail(order: OrderDocument): string | null {
    return order.guestInfo?.email ?? null;
  }

  private calculateShippingFallback(subtotal: number): number {
    return subtotal >= 50000 ? 0 : 5000;
  }
}
