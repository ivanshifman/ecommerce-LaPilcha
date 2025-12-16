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
      .findOne({ _id: userId, deletedAt: { $exists: false }, isActive: true })
      .populate({
        path: 'wishlist',
        match: { status: true },
      })
      .exec();

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user.wishlist.filter(Boolean);
  }

  private async validateProductExists(productId: string): Promise<void> {
    const productExists = await this.productModel.exists({
      _id: productId,
      status: true,
    });

    if (!productExists) {
      throw new NotFoundException('Producto no encontrado');
    }
  }

  async addToWishlist(userId: string, productId: string) {
    await this.validateProductExists(productId);

    const result = await this.userModel
      .findByIdAndUpdate(
        { _id: userId, deletedAt: { $exists: false }, isActive: true },
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
    await this.validateProductExists(productId);

    const result = await this.userModel
      .findByIdAndUpdate(
        { _id: userId, deletedAt: { $exists: false }, isActive: true },
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
      .findByIdAndUpdate(
        { _id: userId, deletedAt: { $exists: false }, isActive: true },
        { wishlist: [] },
        { new: true, select: 'wishlist' },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return result.wishlist;
  }
}
