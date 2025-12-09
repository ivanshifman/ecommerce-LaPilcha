import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, versionKey: false, collection: 'products' })
export class Product {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, index: true })
  category!: string;

  @Prop({ index: true })
  subcategory?: string;

  @Prop({ required: true, unique: true, uppercase: true })
  code!: string;

  @Prop({ default: true })
  status?: boolean;

  @Prop()
  material?: string;

  @Prop({ index: true })
  brand?: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ required: true })
  color!: string;

  @Prop({ min: 0, max: 100, default: 0 })
  discount?: number;

  @Prop({ type: [String], default: [], index: true })
  tags?: string[];

  @Prop({
    type: String,
    enum: ['male', 'female', 'unisex'],
    default: 'unisex',
    index: true,
  })
  gender?: string;

  @Prop({ unique: true, lowercase: true })
  slug?: string;

  @Prop()
  metaDescription?: string;

  @Prop({ default: false })
  featured?: boolean;

  @Prop({ min: 0, default: 0 })
  salesCount?: number;

  @Prop({ min: 0, max: 5, default: 0 })
  rating?: number;

  @Prop({ min: 0, default: 0 })
  reviewsCount?: number;

  @Prop({
    type: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
        minStock: { type: Number, default: 5 },
      },
    ],
    default: [],
  })
  sizes!: Array<{
    size: string;
    stock: number;
    minStock: number;
  }>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(mongoosePaginate);

ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ brand: 1, category: 1 });
ProductSchema.index({ price: 1, status: 1 });
ProductSchema.index({ slug: 1 }, { unique: true, sparse: true });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ status: 1, featured: 1, salesCount: -1 });

ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

ProductSchema.virtual('totalStock').get(function () {
  if (!this.sizes || this.sizes.length === 0) return 0;
  return this.sizes.reduce((sum, s) => sum + s.stock, 0);
});

ProductSchema.virtual('availableSizes').get(function () {
  if (!this.sizes) return [];
  return this.sizes.map((s) => s.size);
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });
