import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Return, ReturnDocument } from './schemas/return.schema';
import { OrderService } from '../order/order.service';
import { StockService } from '../cart/stock.service';
import { MailService } from '../common/mail/mail.service';
import { UserService } from '../user/user.service';
import { PaymentService } from '../payment/payment.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { ApproveReturnDto, RejectReturnDto, InspectReturnDto } from './dto/update-return.dto';
import { ReturnStatus } from './enums/return-status.enum';
import { OrderStatus } from '../order/enums/order-status.enum';

@Injectable()
export class ReturnService {
  constructor(
    @InjectModel(Return.name) private returnModel: Model<ReturnDocument>,
    private readonly orderService: OrderService,
    private readonly stockService: StockService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
  ) {}

  async createReturn(dto: CreateReturnDto, userId?: string): Promise<ReturnDocument> {
    const order = await this.orderService.findById(dto.orderId);

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (userId && order.user && order.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para solicitar devolución de esta orden');
    }

    const validStatuses = [OrderStatus.DELIVERED, OrderStatus.SHIPPED];
    if (!validStatuses.includes(order.status)) {
      throw new BadRequestException(
        'Solo puedes solicitar devolución de órdenes entregadas o en tránsito',
      );
    }

    const deliveryDate = order.deliveredAt || order.createdAt;
    const daysSinceDelivery = Math.floor(
      (Date.now() - (deliveryDate?.getTime() || 0)) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceDelivery > 30) {
      throw new BadRequestException('El período de devolución ha expirado (30 días)');
    }

    const returnItems: Array<{
      product: Types.ObjectId;
      name: string;
      variant?: { size?: string; color?: string };
      quantity: number;
      unitPrice: number;
      reason: string;
      condition?: string;
      image?: string;
    }> = [];
    let requestedAmount = 0;

    for (const item of dto.items) {
      const orderItem = order.items.find(
        (oi) =>
          oi.product.toString() === item.product &&
          oi.variant?.size === item.size &&
          oi.variant?.color === item.color,
      );

      if (!orderItem) {
        throw new BadRequestException(`Producto no encontrado en la orden`);
      }

      if (item.quantity > orderItem.quantity) {
        throw new BadRequestException(`Cantidad solicitada mayor a la cantidad comprada`);
      }

      requestedAmount += orderItem.unitPrice * item.quantity;

      returnItems.push({
        product: new Types.ObjectId(item.product),
        name: orderItem.name,
        variant: orderItem.variant,
        quantity: item.quantity,
        unitPrice: orderItem.unitPrice,
        reason: item.reason,
        condition: item.condition,
        image: orderItem.image,
      });
    }

    const newReturn = new this.returnModel({
      order: new Types.ObjectId(dto.orderId),
      user: userId ? new Types.ObjectId(userId) : undefined,
      items: returnItems,
      status: ReturnStatus.PENDING_APPROVAL,
      primaryReason: dto.primaryReason,
      customerComment: dto.customerComment,
      customerImages: dto.customerImages,
      requestedAmount,
    });

    await newReturn.save();

    order.status = OrderStatus.REFUND_PENDING;
    order.statusHistory.push({
      status: OrderStatus.REFUND_PENDING,
      timestamp: new Date(),
      note: `Devolución solicitada: ${newReturn.returnNumber}`,
    });
    await order.save();

    const email = await this.getReturnEmail(newReturn);
    if (email) {
      await this.mailService.sendReturnRequested(email, newReturn.returnNumber, order.orderNumber);
    }

    return newReturn;
  }

  async approveReturn(
    returnId: string,
    adminId: string,
    dto: ApproveReturnDto,
  ): Promise<ReturnDocument> {
    const returnDoc = await this.returnModel.findById(returnId).exec();

    if (!returnDoc) {
      throw new NotFoundException('Devolución no encontrada');
    }

    if (returnDoc.status !== ReturnStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Esta devolución no está pendiente de aprobación');
    }

    returnDoc.status = ReturnStatus.APPROVED;
    returnDoc.approvedAmount = dto.approvedAmount || returnDoc.requestedAmount;
    returnDoc.resolution = dto.resolution || returnDoc.resolution;
    returnDoc.adminNotes = dto.adminNotes;
    returnDoc.approvedBy = new Types.ObjectId(adminId);
    returnDoc.approvedAt = new Date();

    returnDoc.statusHistory.push({
      status: ReturnStatus.APPROVED,
      timestamp: new Date(),
      note: dto.adminNotes,
      updatedBy: new Types.ObjectId(adminId),
    });

    await returnDoc.save();

    const email = await this.getReturnEmail(returnDoc);
    if (email) {
      await this.mailService.sendReturnApproved(
        email,
        returnDoc.returnNumber,
        returnDoc.approvedAmount,
      );
    }

    return returnDoc;
  }

  async rejectReturn(
    returnId: string,
    adminId: string,
    dto: RejectReturnDto,
  ): Promise<ReturnDocument> {
    const returnDoc = await this.returnModel.findById(returnId).exec();

    if (!returnDoc) {
      throw new NotFoundException('Devolución no encontrada');
    }

    returnDoc.status = ReturnStatus.REJECTED;
    returnDoc.rejectionReason = dto.rejectionReason;
    returnDoc.adminNotes = dto.adminNotes;
    returnDoc.rejectedBy = new Types.ObjectId(adminId);
    returnDoc.rejectedAt = new Date();

    returnDoc.statusHistory.push({
      status: ReturnStatus.REJECTED,
      timestamp: new Date(),
      note: dto.rejectionReason,
      updatedBy: new Types.ObjectId(adminId),
    });

    await returnDoc.save();

    const order = await this.orderService.findById(returnDoc.order.toString());
    if (order) {
      order.status = OrderStatus.DELIVERED;
      await order.save();
    }

    const email = await this.getReturnEmail(returnDoc);
    if (email) {
      await this.mailService.sendReturnRejected(email, returnDoc.returnNumber, dto.rejectionReason);
    }

    return returnDoc;
  }

  async markAsReceived(
    returnId: string,
    adminId: string,
    trackingNumber?: string,
  ): Promise<ReturnDocument> {
    const returnDoc = await this.returnModel.findById(returnId).exec();

    if (!returnDoc) {
      throw new NotFoundException('Devolución no encontrada');
    }

    if (returnDoc.status === ReturnStatus.REFUNDED) {
      return returnDoc;
    }

    returnDoc.status = ReturnStatus.RECEIVED;
    returnDoc.receivedAt = new Date();
    returnDoc.trackingNumber = trackingNumber;

    returnDoc.statusHistory.push({
      status: ReturnStatus.RECEIVED,
      timestamp: new Date(),
      note: 'Producto recibido en almacén',
      updatedBy: new Types.ObjectId(adminId),
    });

    await this.restoreStock(returnDoc);
    await returnDoc.save();

    const email = await this.getReturnEmail(returnDoc);
    if (email) {
      await this.mailService.sendReturnReceived(email, returnDoc.returnNumber);
    }

    return returnDoc;
  }

  async inspectReturn(
    returnId: string,
    adminId: string,
    dto: InspectReturnDto,
  ): Promise<ReturnDocument> {
    const returnDoc = await this.returnModel.findById(returnId).exec();

    if (!returnDoc) {
      throw new NotFoundException('Devolución no encontrada');
    }

    returnDoc.status = ReturnStatus.INSPECTING;
    returnDoc.inspectionNotes = dto.inspectionNotes;
    returnDoc.inspectedAt = new Date();

    if (dto.approveRefund) {
      returnDoc.status = ReturnStatus.APPROVED_REFUND;
      returnDoc.approvedAmount = dto.approvedAmount || returnDoc.requestedAmount;

      await this.processRefund(returnDoc, adminId);
    } else {
      returnDoc.status = ReturnStatus.REJECTED;
      returnDoc.rejectionReason = 'Producto no cumple con condiciones de devolución';
    }

    returnDoc.statusHistory.push({
      status: returnDoc.status,
      timestamp: new Date(),
      note: dto.inspectionNotes,
      updatedBy: new Types.ObjectId(adminId),
    });

    await returnDoc.save();

    return returnDoc;
  }

  private async processRefund(returnDoc: ReturnDocument, adminId: string): Promise<void> {
    const order = await this.orderService.findById(returnDoc.order.toString());
    if (!order) return;

    try {
      const payment = await this.paymentService.getPaymentByOrderIdAdmin(order._id.toString());

      if (payment && payment.externalId) {
        await this.paymentService.refundPayment(payment.id as string, adminId);

        returnDoc.status = ReturnStatus.REFUNDED;
        returnDoc.refundedAmount = returnDoc.approvedAmount;
        returnDoc.refundedAt = new Date();
        await returnDoc.save();

        const email = await this.getReturnEmail(returnDoc);
        if (email) {
          await this.mailService.sendReturnRefundProcessed(
            email,
            returnDoc.returnNumber,
            returnDoc.refundedAmount ?? 0,
            order.paymentMethod || 'N/A',
          );
        }
      }
    } catch (error) {
      console.error('Error procesando reembolso automático:', error);
    }
  }

  private async restoreStock(returnDoc: ReturnDocument): Promise<void> {
    if (returnDoc.stockRestored) return;

    for (const item of returnDoc.items) {
      if (item.variant?.size) {
        await this.stockService.restoreStockFromReturn(
          item.product.toString(),
          item.variant.size,
          item.quantity,
        );
      }
    }

    returnDoc.stockRestored = true;
  }

  async getMyReturns(userId: string) {
    return this.returnModel.find({ user: userId }).sort({ createdAt: -1 }).populate('order').exec();
  }

  async getAllReturns(status?: ReturnStatus) {
    const filter = status ? { status } : {};
    return this.returnModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('order')
      .populate('user')
      .exec();
  }

  async getReturnById(returnId: string, userId?: string): Promise<ReturnDocument> {
    const returnDoc = await this.returnModel.findById(returnId).populate('order').exec();

    if (!returnDoc) {
      throw new NotFoundException('Devolución no encontrada');
    }

    if (userId && returnDoc.user && returnDoc.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta devolución');
    }

    return returnDoc;
  }

  private async getReturnEmail(returnDoc: ReturnDocument): Promise<string | null> {
    const order = await this.orderService.findById(returnDoc.order.toString());
    if (!order) return null;

    if (order.user) {
      const user = await this.userService.findById(order.user.toString());
      return user?.email ?? null;
    }

    return this.orderService.getOrderEmail(order);
  }
}
