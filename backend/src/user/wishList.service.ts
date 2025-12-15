import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getWishlist(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'wishlist',
        match: { status: true },
      })
      .exec();

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user.wishlist.filter(Boolean);
  }

  async addToWishlist(userId: string, productId: string) {
    const productExists = await this.productModel.exists({
      _id: productId,
      status: true,
    });

    if (!productExists) {
      throw new NotFoundException('Producto no encontrado');
    }

    const result = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true, select: 'wishlist' },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return result.wishlist;
  }

  async removeFromWishlist(userId: string, productId: string) {
    const productExists = await this.productModel.exists({
      _id: productId,
      status: true,
    });

    if (!productExists) {
      throw new NotFoundException('Producto no encontrado');
    }

    const result = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true, select: 'wishlist' },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return result.wishlist;
  }

  async clearWishlist(userId: string) {
    const result = await this.userModel
      .findByIdAndUpdate(userId, { wishlist: [] }, { new: true, select: 'wishlist' })
      .exec();

    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return result.wishlist;
  }
}
