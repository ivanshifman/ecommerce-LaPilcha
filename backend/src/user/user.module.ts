import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WishlistService } from './wishList.service';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CartModule,
    ProductModule,
  ],
  controllers: [UserController],
  providers: [UserService, WishlistService],
  exports: [UserService, WishlistService],
})
export class UserModule {}
