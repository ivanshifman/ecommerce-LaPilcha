import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shipping, ShippingDocument } from './schemas/shipping.schema';
import { ShippingStatus, ShippingMethod } from './enums/shipping.enum';
import { OrderStatus } from '../order/enums/order-status.enum';
import { MailService } from '../common/mail/mail.service';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { CreateShippingDto, UpdateShippingStatusDto, UpdateTrackingDto } from './dto/shipping.dto';
import { ShippingResponseDto } from './dto/shipping-response.dto';
import { ShippingMapper } from './mappers/shipping.mapper';

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipping.name) private shippingModel: Model<ShippingDocument>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  async createShipping(dto: CreateShippingDto): Promise<ShippingResponseDto> {
    const order = await this.orderService.findById(dto.orderId);

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    const existingShipping = await this.shippingModel.findOne({ order: dto.orderId }).exec();

    if (existingShipping) {
      throw new BadRequestException('Esta orden ya tiene un envío creado');
    }

    const estimatedDelivery = this.calculateEstimatedDelivery(
      dto.method,
      dto.estimatedDaysMin || 3,
      dto.estimatedDaysMax || 7,
    );

    const shipping = new this.shippingModel({
      order: new Types.ObjectId(dto.orderId),
      method: dto.method,
      status: ShippingStatus.PENDING,
      cost: dto.cost,
      weight: dto.weight,
      address: order.shippingAddress,
      estimatedDeliveryDate: estimatedDelivery,
      carrier: dto.carrier,
      notes: dto.notes,
      adminNotes: dto.adminNotes,
    });

    await shipping.save();

    return ShippingMapper.toShippingResponseDto(shipping);
  }

  async updateShippingStatus(
    shippingId: string,
    dto: UpdateShippingStatusDto,
    adminId: string,
  ): Promise<ShippingResponseDto> {
    const shipping = await this.shippingModel.findById(shippingId).exec();

    if (!shipping) {
      throw new NotFoundException('Envío no encontrado');
    }

    shipping.status = dto.status;

    shipping.trackingHistory.push({
      status: dto.status,
      timestamp: new Date(),
      location: dto.location,
      note: dto.note,
      updatedBy: new Types.ObjectId(adminId),
    });

    if (dto.status === ShippingStatus.PREPARING && !shipping.preparedAt) {
      shipping.preparedAt = new Date();
    }

    if (dto.status === ShippingStatus.IN_TRANSIT && !shipping.dispatchedAt) {
      shipping.dispatchedAt = new Date();
    }

    if (dto.status === ShippingStatus.DELIVERED) {
      shipping.actualDeliveryDate = new Date();
      if (dto.deliveredTo) {
        shipping.deliveredTo = dto.deliveredTo;
      }
    }

    if (dto.status === ShippingStatus.FAILED && dto.failureReason) {
      shipping.failureReason = dto.failureReason;
    }

    await shipping.save();

    await this.syncOrderStatus(shipping, adminId);

    await this.sendStatusUpdateEmail(shipping);

    return ShippingMapper.toShippingResponseDto(shipping);
  }

  async updateTracking(shippingId: string, dto: UpdateTrackingDto): Promise<ShippingResponseDto> {
    const shipping = await this.shippingModel.findById(shippingId).exec();

    if (!shipping) {
      throw new NotFoundException('Envío no encontrado');
    }

    if (dto.trackingNumber !== undefined) {
      shipping.trackingNumber = dto.trackingNumber;
    }

    if (dto.carrier !== undefined) {
      shipping.carrier = dto.carrier;
    }

    if (dto.estimatedDeliveryDate !== undefined) {
      shipping.estimatedDeliveryDate = new Date(dto.estimatedDeliveryDate);
    }

    if (dto.adminNotes !== undefined) {
      shipping.adminNotes = dto.adminNotes;
    }

    if (dto.labelUrl !== undefined) {
      shipping.labelUrl = dto.labelUrl;
    }

    await shipping.save();

    return ShippingMapper.toShippingResponseDto(shipping);
  }

  async getShippingByOrderId(orderId: string): Promise<ShippingResponseDto | null> {
    const shipping = await this.shippingModel
      .findOne({ order: new Types.ObjectId(orderId) })
      .exec();

    if (!shipping) {
      throw new NotFoundException('Orden no encontrada');
    }

    return ShippingMapper.toShippingResponseDto(shipping);
  }

  async getShippingById(shippingId: string): Promise<ShippingResponseDto> {
    const shipping = await this.shippingModel.findById(shippingId).exec();

    if (!shipping) {
      throw new NotFoundException('Envío no encontrado');
    }

    return ShippingMapper.toShippingResponseDto(shipping);
  }

  async getAllShippings(status?: ShippingStatus): Promise<ShippingResponseDto[]> {
    const filter = status ? { status } : {};

    const shippings = await this.shippingModel.find(filter).sort({ createdAt: -1 }).exec();

    return shippings.map((s) => ShippingMapper.toShippingResponseDto(s));
  }

  async getPendingShippings(): Promise<ShippingResponseDto[]> {
    const shippings = await this.shippingModel
      .find({
        status: { $in: [ShippingStatus.PENDING, ShippingStatus.PREPARING] },
      })
      .sort({ createdAt: 1 })
      .exec();

    return shippings.map((s) => ShippingMapper.toShippingResponseDto(s));
  }

  generateTrackingNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `LP-${dateStr}-${random}`;
  }

  private async syncOrderStatus(shipping: ShippingDocument, adminId: string): Promise<void> {
    const order = await this.orderService.findById(shipping.order.toString());

    if (!order) {
      return;
    }

    let newOrderStatus: OrderStatus | null = null;

    switch (shipping.status) {
      case ShippingStatus.IN_TRANSIT:
      case ShippingStatus.OUT_FOR_DELIVERY:
        if (order.status === OrderStatus.PAID || order.status === OrderStatus.PROCESSING) {
          newOrderStatus = OrderStatus.SHIPPED;
        }
        break;

      case ShippingStatus.DELIVERED:
        if (
          order.status === OrderStatus.PAID ||
          order.status === OrderStatus.PROCESSING ||
          order.status === OrderStatus.SHIPPED
        ) {
          newOrderStatus = OrderStatus.DELIVERED;
          order.deliveredAt = new Date();
        }
        break;

      case ShippingStatus.READY_FOR_PICKUP:
        if (order.status === OrderStatus.PAID) {
          newOrderStatus = OrderStatus.PROCESSING;
        }
        break;

      case ShippingStatus.FAILED:
      case ShippingStatus.RETURNED:
        break;
    }

    if (newOrderStatus) {
      order.status = newOrderStatus;
      order.statusHistory.push({
        status: newOrderStatus,
        timestamp: new Date(),
        note: `Estado actualizado automáticamente desde envío`,
        updatedBy: new Types.ObjectId(adminId),
      });

      await order.save();
    }
  }

  private calculateEstimatedDelivery(
    method: ShippingMethod,
    minDays: number,
    maxDays: number,
  ): Date {
    let daysToAdd = maxDays;

    if (method === ShippingMethod.EXPRESS) {
      daysToAdd = minDays;
    } else if (method === ShippingMethod.PICKUP) {
      daysToAdd = 2;
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

    return estimatedDate;
  }

  private async sendStatusUpdateEmail(shipping: ShippingDocument): Promise<void> {
    const order = await this.orderService.findById(shipping.order.toString());

    if (!order) return;

    let email: string | null = null;

    if (order.user) {
      const user = await this.userService.findById(order.user.toString());
      email = user?.email ?? null;
    } else {
      email = this.orderService.getOrderEmail(order);
    }

    if (!email) return;

    try {
      if (shipping.status === ShippingStatus.IN_TRANSIT) {
        await this.mailService.sendOrderShipped(email, order.orderNumber, shipping.trackingNumber);
      } else if (shipping.status === ShippingStatus.DELIVERED) {
        await this.mailService.sendOrderDelivered(email, order.orderNumber);
      } else if (shipping.status === ShippingStatus.READY_FOR_PICKUP) {
        await this.mailService.sendReadyForPickup(email, order.orderNumber);
      }
    } catch (error) {
      console.error('Error enviando email de actualización de envío:', error);
    }
  }
}
