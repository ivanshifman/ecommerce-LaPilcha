import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentService } from '../payment.service';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class PaymentJob {
  private readonly logger = new Logger(PaymentJob.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cancelExpiredPendingPayments() {
    const cancelledPayments = await this.paymentService.cancelExpiredPayments({
      status: PaymentStatus.PENDING,
    });

    if (cancelledPayments > 0) {
      this.logger.log(`Pagos cancelados automáticamente: ${cancelledPayments}`);
    }
  }
}
