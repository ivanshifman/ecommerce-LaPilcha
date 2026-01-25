import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import { randomUUID } from 'crypto';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { StockService } from './stock.service';
import { AddToCartDto } from './dto/add-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartPopulated } from './types/cartPopuled.type';
import { CartMapper } from './mappers/cart.mapper';
import { CART_COOKIE, cartCookieOptions } from '../common/utils/cookie.util';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly configService: ConfigService,
    private readonly stockService: StockService,
  ) {}

  async addToCart(
    dto: AddToCartDto,
    userId?: string,
    anonymousId?: string,
    res?: Response,
  ): Promise<{ cart: CartResponseDto; anonymousId?: string }> {
    const product = await this.stockService.validateProduct(dto.product);
    await this.stockService.validateStock(product, dto.variant, dto.quantity);

    let cart: CartDocument;
    let finalAnonymousId: string | undefined;

    if (userId) {
      cart = await this.getOrCreateUserCart(userId);
    } else {
      const result = await this.getOrCreateAnonymousCart(anonymousId);
      cart = result.cart;
      finalAnonymousId = result.anonymousId;

      if (res) {
        res.cookie(CART_COOKIE, finalAnonymousId, cartCookieOptions(this.configService));
      }
    }

    const index = this.findItemIndex(cart, dto.product, dto.variant);

    if (index >= 0) {
      cart.items[index].quantity += dto.quantity;
    } else {
      const discount = product.discount ?? 0;
      const finalPrice = product.price - product.price * (discount / 100);

      cart.items.push({
        product: new Types.ObjectId(dto.product),
        variant: dto.variant
          ? {
              size: dto.variant.size?.toUpperCase(),
              color: dto.variant.color?.toLowerCase(),
            }
          : undefined,
        quantity: dto.quantity,
        addedAt: new Date(),
        priceAtAdd: finalPrice,
      });
    }

    await cart.save();

    await this.stockService.reserveStock(dto.product, dto.variant?.size, dto.quantity);

    const populatedCart = await this.getPopulatedCart(userId, finalAnonymousId ?? anonymousId);

    return {
      cart: CartMapper.toCartResponseDto(populatedCart, !userId),
      anonymousId: finalAnonymousId,
    };
  }

  async updateCartItem(
    dto: UpdateCartItemDto,
    userId?: string,
    anonymousId?: string,
    res?: Response,
  ): Promise<CartResponseDto> {
    const cart = await this.getCartDocument(userId, anonymousId);

    const index = this.findItemIndex(cart, dto.product, dto.variant);
    if (index < 0) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    const product = await this.stockService.validateProduct(dto.product);

    const oldQuantity = cart.items[index].quantity;
    const quantityDiff = dto.quantity - oldQuantity;

    if (quantityDiff > 0) {
      await this.stockService.validateStock(product, dto.variant, quantityDiff);
      await this.stockService.reserveStock(dto.product, dto.variant?.size, quantityDiff);
    }

    if (quantityDiff < 0) {
      await this.stockService.releaseStock(dto.product, dto.variant?.size, Math.abs(quantityDiff));
    }

    cart.items[index].quantity = dto.quantity;
    await cart.save();

    const populatedCart = await this.getPopulatedCart(userId, anonymousId);

    if (!userId && anonymousId && res) {
      this.updateAnonymousCookie(anonymousId, res);
    }

    return CartMapper.toCartResponseDto(populatedCart, !userId);
  }

  async removeFromCart(
    dto: RemoveCartItemDto,
    userId?: string,
    anonymousId?: string,
    res?: Response,
  ): Promise<CartResponseDto> {
    const cart = await this.getCartDocument(userId, anonymousId);

    const index = this.findItemIndex(cart, dto.product, dto.variant);
    if (index < 0) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    const item = cart.items[index];
    await this.stockService.releaseStock(
      item.product.toString(),
      item.variant?.size,
      item.quantity,
    );

    cart.items.splice(index, 1);
    await cart.save();

    const populatedCart = await this.getPopulatedCart(userId, anonymousId);

    if (!userId && anonymousId && res) {
      this.updateAnonymousCookie(anonymousId, res);
    }

    return CartMapper.toCartResponseDto(populatedCart, !userId);
  }

  async getCart(userId?: string, anonymousId?: string, res?: Response): Promise<CartResponseDto> {
    const cartDoc = await this.getCartDocument(userId, anonymousId);
    const cart = await this.getPopulatedCart(userId, anonymousId);

    const invalidItemsIndices: number[] = [];

    cart.items.forEach((item, index) => {
      if (!item.product || item.product.status === false) {
        invalidItemsIndices.push(index);
        if (item.variant?.size) {
          this.stockService
            .releaseStock(item.product?._id?.toString() || '', item.variant.size, item.quantity)
            .catch(() => {});
        }
      }
    });

    if (invalidItemsIndices.length > 0) {
      cartDoc.items = cartDoc.items.filter((_, index) => !invalidItemsIndices.includes(index));
      await cartDoc.save();

      const updatedCart = await this.getPopulatedCart(userId, anonymousId);
      return CartMapper.toCartResponseDto(updatedCart, !userId);
    }

    if (!userId && anonymousId && res) {
      this.updateAnonymousCookie(anonymousId, res);
    }

    return CartMapper.toCartResponseDto(cart, !userId);
  }

  async clearCart(userId?: string, anonymousId?: string, res?: Response): Promise<CartResponseDto> {
    const cart = await this.getCartDocument(userId, anonymousId);

    for (const item of cart.items) {
      await this.stockService.releaseStock(
        item.product.toString(),
        item.variant?.size,
        item.quantity,
      );
    }

    if (!userId && anonymousId) {
      await this.cartModel.findByIdAndDelete(cart._id);

      if (res) {
        res.clearCookie(CART_COOKIE, {
          httpOnly: true,
          path: '/',
        });
      }

      return {
        id: '',
        items: [],
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        isAnonymous: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdAtLocal: '',
        updatedAtLocal: '',
      };
    }

    cart.items = [];
    await cart.save();

    const populatedCart = await this.getPopulatedCart(userId);
    return CartMapper.toCartResponseDto(populatedCart, false);
  }

  async mergeAnonymousCart(
    userId: string,
    anonymousId: string | undefined,
    res?: Response,
  ): Promise<{ cart: CartResponseDto }> {
    if (!anonymousId) {
      const populatedCart = await this.getPopulatedCart(userId);
      return { cart: CartMapper.toCartResponseDto(populatedCart, false) };
    }

    const anonymousCart = await this.cartModel.findOne({ anonymousId }).exec();

    if (!anonymousCart || anonymousCart.items.length === 0) {
      if (res) {
        res.clearCookie(CART_COOKIE, { httpOnly: true, path: '/' });
      }

      const populatedCart = await this.getPopulatedCart(userId);
      return { cart: CartMapper.toCartResponseDto(populatedCart, false) };
    }

    const userCart = await this.getOrCreateUserCart(userId);

    for (const item of anonymousCart.items) {
      const index = this.findItemIndex(userCart, item.product.toString(), item.variant);

      if (index >= 0) {
        userCart.items[index].quantity += item.quantity;
      } else {
        userCart.items.push({
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
          addedAt: item.addedAt,
          priceAtAdd: item.priceAtAdd,
        });
      }
    }

    await userCart.save();
    await this.cartModel.findByIdAndDelete(anonymousCart._id);

    if (res) {
      res.clearCookie(CART_COOKIE, { httpOnly: true, path: '/' });
    }

    const populatedCart = await this.getPopulatedCart(userId);

    return {
      cart: CartMapper.toCartResponseDto(populatedCart, false),
    };
  }

  async deleteCartAndReleaseStockByUser(userId: string): Promise<void> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) return;

    for (const item of cart.items) {
      if (item.variant?.size) {
        await this.stockService.releaseStock(
          item.product.toString(),
          item.variant?.size,
          item.quantity,
        );
      }
    }

    await this.cartModel.findByIdAndDelete(cart._id);
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
    const id = anonymousId ?? (await this.generateAnonymousId());

    let cart = await this.cartModel.findOne({ anonymousId: id }).exec();

    if (!cart) {
      cart = new this.cartModel({ anonymousId: id, items: [] });
      await cart.save();
    }

    return { cart, anonymousId: id };
  }

  private async getCartDocument(userId?: string, anonymousId?: string): Promise<CartDocument> {
    if (userId) {
      return this.getOrCreateUserCart(userId);
    }

    const { cart } = await this.getOrCreateAnonymousCart(anonymousId);
    return cart;
  }

  private async getPopulatedCart(userId?: string, anonymousId?: string): Promise<CartPopulated> {
    const cart = userId
      ? await this.cartModel.findOne({ user: userId }).populate('items.product').exec()
      : await this.cartModel.findOne({ anonymousId }).populate('items.product').exec();

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const validItems = cart.items.filter((item) => {
      return item.product !== null && item.product !== undefined;
    });

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return cart.toObject() as unknown as CartPopulated;
  }

  private findItemIndex(
    cart: CartDocument,
    productId: string,
    variant?: { size?: string; color?: string },
  ): number {
    return cart.items.findIndex((item) => {
      if (item.product.toString() !== productId) return false;

      if (!variant || (!variant.size && !variant.color)) {
        return (
          !item.variant ||
          ((!item.variant.size || item.variant.size === '') &&
            (!item.variant.color || item.variant.color === ''))
        );
      }

      let sizeMatch = true;
      let colorMatch = true;

      if (variant.size !== undefined && variant.size !== '') {
        sizeMatch = item.variant?.size?.toUpperCase() === variant.size.toUpperCase();
      }

      if (variant.color !== undefined && variant.color !== '') {
        colorMatch = item.variant?.color?.toLowerCase() === variant.color.toLowerCase();
      }

      return sizeMatch && colorMatch;
    });
  }

  private async generateAnonymousId(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const id = randomUUID();
      const exists = await this.cartModel.exists({ anonymousId: id });
      if (!exists) {
        return id;
      }
      attempts++;
    }

    throw new Error('No se pudo generar un ID único para el carrito');
  }

  private updateAnonymousCookie(anonymousId: string | undefined, res?: Response): void {
    if (anonymousId && res) {
      res.cookie(CART_COOKIE, anonymousId, cartCookieOptions(this.configService));
    }
  }
}
