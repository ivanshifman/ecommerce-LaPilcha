import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getWishlist(userId: string) {
    const user = await this.userModel.findById(userId).populate('wishlist').exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user.wishlist;
  }

  async addToWishlist(userId: string, productId: string) {
    const productObjectId = new Types.ObjectId(productId);

    const result = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $addToSet: { wishlist: productObjectId },
        },
        { new: true, select: 'wishlist' },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return result.wishlist;
  }

  async removeFromWishlist(userId: string, productId: string) {
    const productObjectId = new Types.ObjectId(productId);

    const result = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: { wishlist: productObjectId },
        },
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
