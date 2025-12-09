import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: PaginateModel<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = new this.productModel(dto);
    return product.save();
  }

  async findAll(query: QueryProductDto) {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      subcategory,
      color,
      size,
      brand,
      priceMin,
      priceMax,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const filter: Record<string, unknown> = {};

    if (search) filter.$text = { $search: search };

    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (category) filter.category = { $regex: new RegExp(`^${escapeRegex(category)}$`, 'i') };
    if (subcategory)
      filter.subcategory = { $regex: new RegExp(`^${escapeRegex(subcategory)}$`, 'i') };
    if (color) filter.color = { $regex: new RegExp(`^${escapeRegex(color)}$`, 'i') };
    if (brand) filter.brand = { $regex: new RegExp(`^${escapeRegex(brand)}$`, 'i') };
    if (size) {
      filter.sizes = {
        $elemMatch: {
          size: { $regex: new RegExp(`^${escapeRegex(size)}$`, 'i') },
          stock: { $gt: 0 },
        },
      };
    }

    if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
      throw new BadRequestException('priceMin no puede ser mayor que priceMax');
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      filter.price = {};
      if (priceMin !== undefined) {
        (filter.price as Record<string, number>).$gte = priceMin;
      }
      if (priceMax !== undefined) {
        (filter.price as Record<string, number>).$lte = priceMax;
      }
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    return this.productModel.paginate(filter, {
      page,
      limit,
      sort,
    });
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    );

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { status: false },
      { new: true, runValidators: true },
    );

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return {
      message: 'Producto deshabilitado',
      product,
    };
  }
}
