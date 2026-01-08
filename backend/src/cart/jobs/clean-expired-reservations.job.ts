import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Product, ProductDocument } from '../../product/schemas/product.schema';

@Injectable()
export class CleanExpiredReservationsJob {
  private readonly logger = new Logger(CleanExpiredReservationsJob.name);

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM, {
    name: 'clean-expired-reservations',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleCleanExpiredReservations() {
    this.logger.log('🧹 Iniciando limpieza de reservas expiradas...');

    try {
      const expiredCarts = await this.cartModel
        .find({
          anonymousId: { $exists: true },
          expiresAt: { $lt: new Date() },
        })
        .exec();

      let totalReservationsReleased = 0;

      for (const cart of expiredCarts) {
        for (const item of cart.items) {
          if (item.variant?.size) {
            try {
              const result = await this.productModel.findOneAndUpdate(
                {
                  _id: item.product,
                  'sizes.size': item.variant.size.toUpperCase(),
                },
                {
                  $inc: { 'sizes.$.reserved': -item.quantity },
                },
              );

              if (result) {
                totalReservationsReleased += item.quantity;
              }
            } catch (error: any) {
              this.logger.warn(`Error liberando reserva: ${error}`);
            }
          }
        }
      }

      this.logger.log(
        `✅ Limpieza de reservas completada:` +
          `\n   - ${expiredCarts.length} carritos procesados` +
          `\n   - ${totalReservationsReleased} unidades liberadas`,
      );
    } catch (error) {
      this.logger.error('❌ Error al limpiar reservas expiradas:', error);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS, {
    name: 'partial-cleanup',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handlePartialCleanup() {
    this.logger.log('🧹 Limpieza parcial de reservas...');
    await this.handleCleanExpiredReservations();
  }
}
