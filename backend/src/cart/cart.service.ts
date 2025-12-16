import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { AddToCartDto } from './dto/add-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartPopulated } from './types/cartPopuled.type';
import { CartMapper } from './mappers/cart.mapper';
import { randomUUID } from 'crypto';
import { CART_COOKIE, cartCookieOptions } from '../common/utils/cookie.util';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private configService: ConfigService,
  ) {}

  async addToCart(
    dto: AddToCartDto,
    userId?: string,
    anonymousId?: string,
    res?: Response,
  ): Promise<{ cart: CartResponseDto; anonymousId?: string }> {
    const product = await this.validateProduct(dto.product);
    await this.validateStock(product, dto.variant, dto.quantity);

    let cart: CartDocument;
    let newAnonymousId: string | undefined;

    if (userId) {
      cart = await this.getOrCreateUserCart(userId);
    } else {
      const result = await this.getOrCreateAnonymousCart(anonymousId);
      cart = result.cart;
      newAnonymousId = result.anonymousId;
      if (res && newAnonymousId && newAnonymousId !== anonymousId) {
        res.cookie(CART_COOKIE, newAnonymousId, cartCookieOptions(this.configService));
      }
    }

    const index = this.findItemIndex(cart, dto.product, dto.variant);

    if (index >= 0) {
      const newQuantity = cart.items[index].quantity + dto.quantity;
      await this.validateStock(product, dto.variant, newQuantity);
      cart.items[index].quantity = newQuantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(dto.product),
        variant: dto.variant,
        quantity: dto.quantity,
        addedAt: new Date(),
      });
    }

    await cart.save();

    const populatedCart = await this.getPopulatedCart(userId, newAnonymousId ?? anonymousId);

    return {
      cart: CartMapper.toCartResponseDto(populatedCart, !userId),
      anonymousId: newAnonymousId,
    };
  }

  async updateCartItem(
    dto: UpdateCartItemDto,
    userId?: string,
    anonymousId?: string,
  ): Promise<CartResponseDto> {
    const cart = await this.getCartDocument(userId, anonymousId);

    const index = this.findItemIndex(cart, dto.product, dto.variant);
    if (index < 0) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    const product = await this.validateProduct(dto.product);
    await this.validateStock(product, dto.variant, dto.quantity);

    cart.items[index].quantity = dto.quantity;
    await cart.save();

    const populatedCart = await this.getPopulatedCart(userId, anonymousId);
    return CartMapper.toCartResponseDto(populatedCart, !userId);
  }

  async removeFromCart(
    dto: RemoveCartItemDto,
    userId?: string,
    anonymousId?: string,
  ): Promise<CartResponseDto> {
    const cart = await this.getCartDocument(userId, anonymousId);

    const index = this.findItemIndex(cart, dto.product, dto.variant);
    if (index < 0) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    cart.items.splice(index, 1);
    await cart.save();

    const populatedCart = await this.getPopulatedCart(userId, anonymousId);
    return CartMapper.toCartResponseDto(populatedCart, !userId);
  }

  async getCart(userId?: string, anonymousId?: string): Promise<CartResponseDto> {
    const cart = await this.getPopulatedCart(userId, anonymousId);
    return CartMapper.toCartResponseDto(cart, !userId);
  }

  async clearCart(userId?: string, anonymousId?: string): Promise<CartResponseDto> {
    const cart = await this.getCartDocument(userId, anonymousId);

    cart.items = [];
    await cart.save();

    const populatedCart = await this.getPopulatedCart(userId, anonymousId);
    return CartMapper.toCartResponseDto(populatedCart, !userId);
  }

  async mergeAnonymousCart(
    userId: string,
    anonymousId: string | undefined,
    res?: Response,
  ): Promise<CartResponseDto> {
    if (!anonymousId) {
      const populatedCart = await this.getPopulatedCart(userId);
      return CartMapper.toCartResponseDto(populatedCart, false);
    }

    const anonymousCart = await this.cartModel
      .findOne({ anonymousId })
      .populate('items.product')
      .exec();

    const userCart = await this.getOrCreateUserCart(userId);

    if (anonymousCart && anonymousCart.items.length > 0) {
      for (const item of anonymousCart.items) {
        try {
          const product = await this.validateProduct(item.product.toString());
          await this.validateStock(product, item.variant, item.quantity);

          const index = this.findItemIndex(userCart, item.product.toString(), item.variant);

          if (index >= 0) {
            const newQty = userCart.items[index].quantity + item.quantity;
            try {
              await this.validateStock(product, item.variant, newQty);
              userCart.items[index].quantity = newQty;
            } catch {
              continue;
            }
          } else {
            userCart.items.push({
              product: item.product,
              variant: item.variant,
              quantity: item.quantity,
              addedAt: item.addedAt,
            });
          }
        } catch {
          continue;
        }
      }

      await userCart.save();
      await this.cartModel.findByIdAndDelete(anonymousCart._id);
    }

    if (res && anonymousCart) {
      res.clearCookie(CART_COOKIE, {
        httpOnly: true,
        path: '/',
      });
    }

    const populatedCart = await this.getPopulatedCart(userId);
    return CartMapper.toCartResponseDto(populatedCart, false);
  }

  private async getOrCreateUserCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ user: userId }).exec();

    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
      await cart.save();
    }

    return cart;
  }

  private async getOrCreateAnonymousCart(
    anonymousId?: string,
  ): Promise<{ cart: CartDocument; anonymousId: string }> {
    const id = anonymousId ?? this.generateAnonymousId();

    let cart = await this.cartModel.findOne({ anonymousId: id }).exec();

    if (!cart) {
      cart = new this.cartModel({ anonymousId: id, items: [] });
      await cart.save();
    }

    return { cart, anonymousId: id };
  }

  private async getCartDocument(userId?: string, anonymousId?: string): Promise<CartDocument> {
    const cart = userId
      ? await this.cartModel.findOne({ user: userId }).exec()
      : await this.cartModel.findOne({ anonymousId }).exec();

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    return cart;
  }

  private async getPopulatedCart(userId?: string, anonymousId?: string): Promise<CartPopulated> {
    const cart = userId
      ? await this.cartModel.findOne({ user: userId }).populate('items.product').exec()
      : await this.cartModel.findOne({ anonymousId }).populate('items.product').exec();

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    return cart.toObject() as unknown as CartPopulated;
  }

  private async validateProduct(productId: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!product.status) {
      throw new BadRequestException('El producto no está disponible');
    }

    return product;
  }

  private async validateStock(
    product: ProductDocument,
    variant?: { size?: string; color?: string },
    quantity = 1,
  ): Promise<void> {
    await Promise.resolve();

    if (variant?.size) {
      const sizeValue = variant.size.toUpperCase();

      const size = product.sizes.find((s) => s.size.toUpperCase() === sizeValue);

      if (!size) {
        throw new BadRequestException('Talle no disponible');
      }

      if (size.stock < quantity) {
        throw new ConflictException('Stock insuficiente');
      }
    }

    if (variant?.color && product.color.toLowerCase() !== variant.color.toLowerCase()) {
      throw new BadRequestException('Color no disponible');
    }
  }

  private findItemIndex(
    cart: CartDocument,
    productId: string,
    variant?: { size?: string; color?: string },
  ): number {
    return cart.items.findIndex((item) => {
      if (item.product.toString() !== productId) return false;

      if (!variant) return !item.variant;

      const sizeMatch = variant.size
        ? item.variant?.size?.toUpperCase() === variant.size.toUpperCase()
        : !item.variant?.size;

      const colorMatch = variant.color
        ? item.variant?.color?.toLowerCase() === variant.color.toLowerCase()
        : !item.variant?.color;

      return sizeMatch && colorMatch;
    });
  }

  private generateAnonymousId(): string {
    return randomUUID();
  }
}
