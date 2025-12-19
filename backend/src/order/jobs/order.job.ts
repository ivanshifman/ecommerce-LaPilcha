import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from '../order.service';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrderJob {
  private readonly logger = new Logger(OrderJob.name);

  constructor(private readonly orderService: OrderService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cancelExpiredPendingOrders() {
    const cancelledCount = await this.orderService.cancelExpiredOrders({
      status: OrderStatus.PENDING,
      minutes: 30,
    });

    if (cancelledCount > 0) {
      this.logger.log(`Órdenes canceladas automáticamente: ${cancelledCount}`);
    }
  }
}
