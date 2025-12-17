import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductModule } from '../product/product.module';
import { CleanExpiredReservationsJob } from './jobs/clean-expired-reservations.job';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), ProductModule],
  controllers: [CartController],
  providers: [CartService, CleanExpiredReservationsJob],
  exports: [CartService],
})
export class CartModule {}
