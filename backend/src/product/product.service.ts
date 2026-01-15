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

    const filter: Record<string, unknown> = { status: true };

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

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug, status: true });

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return product;
  }

  async getGenders(): Promise<string[]> {
    const genders = await this.productModel.distinct('gender', { status: true });
    return genders.filter(Boolean);
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category', { status: true });
    return categories;
  }

  async getCategoriesByGender(gender: string): Promise<string[]> {
    const categories = await this.productModel.distinct('category', {
      gender: { $regex: new RegExp(`^${gender}$`, 'i') },
      status: true,
    });
    return categories;
  }

  async getSubcategoriesByCategory(category: string): Promise<string[]> {
    const subcategories = await this.productModel.distinct('subcategory', {
      category: { $regex: new RegExp(`^${category}$`, 'i') },
      status: true,
    });
    return subcategories.filter(Boolean);
  }

  async getFeatured() {
    return this.productModel
      .find({ featured: true, status: true })
      .limit(10)
      .sort({ salesCount: -1 })
      .exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return product;
  }

  async getSizes(): Promise<string[]> {
    const products = await this.productModel.find({ status: true }).select('sizes');

    const allSizes = new Set<string>();

    products.forEach((product) => {
      product.sizes?.forEach((sizeObj) => {
        if (sizeObj.size) {
          allSizes.add(sizeObj.size.toUpperCase());
        }
      });
    });

    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const numericSizes: string[] = [];
    const standardSizes: string[] = [];
    const otherSizes: string[] = [];

    Array.from(allSizes).forEach((size) => {
      if (/^\d+$/.test(size)) {
        numericSizes.push(size);
      } else if (sizeOrder.includes(size)) {
        standardSizes.push(size);
      } else {
        otherSizes.push(size);
      }
    });

    numericSizes.sort((a, b) => Number(a) - Number(b));
    standardSizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
    otherSizes.sort();

    return [...standardSizes, ...numericSizes, ...otherSizes];
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
