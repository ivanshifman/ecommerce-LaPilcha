import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProductService } from './product.service';
import { UserRole } from '../user/common/enums/userRole.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('meta/genders')
  getGenders() {
    return this.productService.getGenders();
  }

  @Get('meta/categories')
  getCategories() {
    return this.productService.getCategories();
  }

  @Get('meta/genders/:gender/categories')
  getCategoriesByGender(@Param('gender') gender: string) {
    return this.productService.getCategoriesByGender(gender);
  }

  @Get('meta/categories/:category/subcategories')
  getSubcategories(@Param('category') category: string) {
    return this.productService.getSubcategoriesByCategory(category);
  }

  @Get('meta/featured')
  getFeatured() {
    return this.productService.getFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('variants/:productGroup')
  async getColorVariants(@Param('productGroup') productGroup: string) {
    return this.productService.getColorVariants(productGroup);
  }

  @Get('meta/sizes')
  getSizes() {
    return this.productService.getSizes();
  }

  @Get('meta/brands')
  getBrands() {
    return this.productService.getBrands();
  }

  @Get('filters/sizes')
  async getFilteredSizes(@Query() query: QueryProductDto) {
    return this.productService.getSizesFiltered(query);
  }

  @Get('filters/brands')
  async getFilteredBrands(@Query() query: QueryProductDto) {
    return this.productService.getBrandsFiltered(query);
  }

  @Get('filters/categories')
  async getFilteredCategories(@Query() query: QueryProductDto) {
    return this.productService.getCategoriesFiltered(query);
  }

  @Get('filters/subcategories')
  async getFilteredSubcategories(@Query() query: QueryProductDto) {
    return this.productService.getSubcategoriesFiltered(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
