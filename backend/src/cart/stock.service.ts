import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class StockService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async validateProduct(productId: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!product.status) {
      throw new BadRequestException('El producto no está disponible');
    }

    return product;
  }

  async reserveStock(productId: string, size: string | undefined, quantity: number): Promise<void> {
    if (!size) return;

    const result = await this.productModel.findOneAndUpdate(
      {
        _id: productId,
        $expr: {
          $let: {
            vars: {
              sizeObj: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$sizes',
                      as: 's',
                      cond: { $eq: ['$$s.size', size.toUpperCase()] },
                    },
                  },
                  0,
                ],
              },
            },
            in: {
              $gte: [{ $subtract: ['$$sizeObj.stock', '$$sizeObj.reserved'] }, quantity],
            },
          },
        },
      },
      {
        $inc: { 'sizes.$[elem].reserved': quantity },
      },
      {
        arrayFilters: [{ 'elem.size': size.toUpperCase() }],
        new: true,
      },
    );

    if (!result) {
      throw new ConflictException('No se pudo reservar stock');
    }
  }

  async releaseStock(productId: string, size: string | undefined, quantity: number): Promise<void> {
    if (!size) return;

    await this.productModel.findOneAndUpdate(
      { _id: productId, 'sizes.size': size.toUpperCase() },
      { $inc: { 'sizes.$.reserved': -quantity } },
    );
  }

  async validateStock(
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

      const availableStock = size.stock - (size.reserved ?? 0);

      if (availableStock < quantity) {
        throw new ConflictException(
          `Stock insuficiente. Disponible: ${availableStock}, solicitado: ${quantity}`,
        );
      }
    }

    if (variant?.color && product.color.toLowerCase() !== variant.color.toLowerCase()) {
      throw new BadRequestException('Color no disponible');
    }
  }
}
