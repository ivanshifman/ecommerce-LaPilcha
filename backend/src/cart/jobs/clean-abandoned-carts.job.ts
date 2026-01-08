import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Product, ProductDocument } from '../../product/schemas/product.schema';

@Injectable()
export class CleanAbandonedCartsJob {
  private readonly logger = new Logger(CleanAbandonedCartsJob.name);

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM, {
    name: 'clean-abandoned-anonymous-carts',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleCleanAbandonedCarts() {
    this.logger.log('🧹 Iniciando limpieza de carritos anónimos abandonados...');

    try {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

      const abandonedCarts = await this.cartModel
        .find({
          anonymousId: { $exists: true },
          user: { $exists: false },
          updatedAt: { $lt: twoDaysAgo },
        })
        .exec();

      let totalCartsDeleted = 0;
      let totalReservationsReleased = 0;

      for (const cart of abandonedCarts) {
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
              this.logger.warn(
                `Error liberando stock para producto ${item.product.toString()}: ${error}`,
              );
            }
          }
        }

        await this.cartModel.findByIdAndDelete(cart._id);
        totalCartsDeleted++;
      }

      this.logger.log(
        `✅ Limpieza de carritos abandonados completada:` +
          `\n   - ${totalCartsDeleted} carritos eliminados` +
          `\n   - ${totalReservationsReleased} unidades liberadas`,
      );
    } catch (error) {
      this.logger.error('❌ Error al limpiar carritos abandonados:', error);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS, {
    name: 'clean-empty-anonymous-carts',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleCleanEmptyCarts() {
    this.logger.log('🧹 Iniciando limpieza de carritos anónimos vacíos...');

    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await this.cartModel.deleteMany({
        anonymousId: { $exists: true },
        user: { $exists: false },
        items: { $size: 0 },
        updatedAt: { $lt: oneDayAgo },
      });

      this.logger.log(
        `✅ Limpieza de carritos vacíos completada: ${result.deletedCount} carritos eliminados`,
      );
    } catch (error) {
      this.logger.error('❌ Error al limpiar carritos vacíos:', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'clean-expired-carts',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleCleanExpiredCarts() {
    this.logger.log('🧹 Limpiando carritos con expiresAt vencido...');

    try {
      const expiredCarts = await this.cartModel
        .find({
          expiresAt: { $exists: true, $lt: new Date() },
        })
        .exec();

      let totalReservationsReleased = 0;

      for (const cart of expiredCarts) {
        for (const item of cart.items) {
          if (item.variant?.size) {
            try {
              await this.productModel.findOneAndUpdate(
                {
                  _id: item.product,
                  'sizes.size': item.variant.size.toUpperCase(),
                },
                {
                  $inc: { 'sizes.$.reserved': -item.quantity },
                },
              );
              totalReservationsReleased += item.quantity;
            } catch (error: any) {
              this.logger.warn(`Error liberando stock: ${error}`);
            }
          }
        }
      }

      this.logger.log(
        `✅ Stock liberado de carritos expirados: ${totalReservationsReleased} unidades`,
      );
    } catch (error) {
      this.logger.error('❌ Error limpiando carritos expirados:', error);
    }
  }
}
