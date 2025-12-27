import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { WISHLIST_COOKIE, wishlistCookieOptions } from '../common/utils/cookie.util';

interface WishlistItem {
  productId: string;
  addedAt: number;
}

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly configService: ConfigService,
  ) {}

  async getWishlist(userId?: string, req?: Request) {
    if (userId) {
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

    if (!req) return [];

    const productIds = this.getWishlistFromCookie(req);
    if (productIds.length === 0) return [];

    const products = await this.productModel
      .find({
        _id: { $in: productIds.map((id) => new Types.ObjectId(id)) },
        status: true,
      })
      .exec();

    return products;
  }

  async addToWishlist(productId: string, userId?: string, req?: Request, res?: Response) {
    await this.validateProductExists(productId);

    if (userId) {
      const result = await this.userModel
        .findByIdAndUpdate(
          { _id: userId, deletedAt: { $exists: false }, isActive: true },
          { $addToSet: { wishlist: productId } },
          { new: true, select: 'wishlist' },
        )
        .exec();

      if (!result) throw new NotFoundException('Usuario no encontrado');
      return result.wishlist;
    }

    if (!req || !res) {
      throw new Error('Request/Response requerido para usuarios anónimos');
    }

    const currentWishlist = this.getWishlistFromCookie(req);

    if (!currentWishlist.includes(productId)) {
      currentWishlist.push(productId);
    }

    this.setWishlistCookie(res, currentWishlist);
    return currentWishlist;
  }

  async removeFromWishlist(productId: string, userId?: string, req?: Request, res?: Response) {
    if (userId) {
      const result = await this.userModel
        .findByIdAndUpdate(
          { _id: userId, deletedAt: { $exists: false }, isActive: true },
          { $pull: { wishlist: productId } },
          { new: true, select: 'wishlist' },
        )
        .exec();

      if (!result) throw new NotFoundException('Usuario no encontrado');
      return result.wishlist;
    }

    if (!req || !res) {
      throw new Error('Request/Response requerido para usuarios anónimos');
    }

    const currentWishlist = this.getWishlistFromCookie(req);
    const updatedWishlist = currentWishlist.filter((id) => id !== productId);

    if (updatedWishlist.length === 0) {
      res.clearCookie(WISHLIST_COOKIE, { httpOnly: true, path: '/' });
    } else {
      this.setWishlistCookie(res, updatedWishlist);
    }

    return updatedWishlist;
  }

  async clearWishlist(userId?: string, res?: Response) {
    if (userId) {
      const result = await this.userModel
        .findByIdAndUpdate(
          { _id: userId, deletedAt: { $exists: false }, isActive: true },
          { wishlist: [] },
          { new: true, select: 'wishlist' },
        )
        .exec();

      if (!result) throw new NotFoundException('Usuario no encontrado');
      return result.wishlist;
    }

    if (res) {
      res.clearCookie(WISHLIST_COOKIE, { httpOnly: true, path: '/' });
    }

    return [];
  }

  async mergeAnonymousWishlist(
    userId: string,
    req?: Request,
    res?: Response,
  ): Promise<Types.ObjectId[]> {
    const anonymousProductIds = req ? this.getWishlistFromCookie(req) : [];

    if (anonymousProductIds.length === 0) {
      const user = await this.userModel.findById(userId).select('wishlist').exec();
      return user?.wishlist || [];
    }

    const validProductIds = await this.validateProductIds(anonymousProductIds);

    if (validProductIds.length === 0) {
      if (res) {
        res.clearCookie(WISHLIST_COOKIE, { httpOnly: true, path: '/' });
      }
      const user = await this.userModel.findById(userId).select('wishlist').exec();
      return user?.wishlist || [];
    }

    const result = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            wishlist: {
              $each: validProductIds.map((id) => new Types.ObjectId(id)),
            },
          },
        },
        { new: true, select: 'wishlist' },
      )
      .exec();

    if (res) {
      res.clearCookie(WISHLIST_COOKIE, { httpOnly: true, path: '/' });
    }

    return result?.wishlist || [];
  }

  private getWishlistFromCookie(req: Request): string[] {
    try {
      const cookieValue = req.cookies?.[WISHLIST_COOKIE] as string | undefined;
      if (!cookieValue) return [];

      const items: WishlistItem[] = JSON.parse(cookieValue) as WishlistItem[];
      return items.map((item) => item.productId);
    } catch {
      return [];
    }
  }

  private setWishlistCookie(res: Response, productIds: string[]): void {
    const items: WishlistItem[] = productIds.map((id) => ({
      productId: id,
      addedAt: Date.now(),
    }));

    res.cookie(WISHLIST_COOKIE, JSON.stringify(items), wishlistCookieOptions(this.configService));
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

  private async validateProductIds(productIds: string[]): Promise<string[]> {
    const validIds = await this.productModel
      .find({
        _id: { $in: productIds.map((id) => new Types.ObjectId(id)) },
        status: true,
      })
      .select('_id')
      .exec();

    return validIds.map((p) => p._id.toString());
  }
}
