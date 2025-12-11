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
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const productObjectId = new Types.ObjectId(productId);

    if (!user.wishlist.some((id) => id.equals(productObjectId))) {
      user.wishlist.push(productObjectId);
      await user.save();
    }

    return user.wishlist;
  }

  async removeFromWishlist(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    return user.wishlist;
  }

  async clearWishlist(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.wishlist = [];
    await user.save();
    return user.wishlist;
  }
}
