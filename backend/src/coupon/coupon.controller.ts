import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OptionalJwtAuthGuard } from '../cart/guards/optional-jwt-auth.guard';
import { CouponService } from './coupon.service';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { MongoIdDto } from '../common/dto/mongo-id.dto';
import { UserRole } from '../user/common/enums/userRole.enum';
import { CouponStatus } from './enums/coupon-type.enum';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateCouponDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUserDto;
    return await this.couponService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query('status') status?: CouponStatus) {
    return await this.couponService.findAll(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findById(@Param() params: MongoIdDto) {
    return await this.couponService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param() params: MongoIdDto, @Body() dto: UpdateCouponDto) {
    return await this.couponService.update(params.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param() params: MongoIdDto) {
    await this.couponService.delete(params.id);
    return { message: 'Cupón eliminado exitosamente' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id/stats')
  async getStats(@Param() params: MongoIdDto) {
    return await this.couponService.getCouponStats(params.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('validate')
  async validate(@Body() dto: ValidateCouponDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUserDto | undefined;

    const validationDto = {
      ...dto,
      userId: user?.id,
    };

    return await this.couponService.validateCoupon(validationDto);
  }

  @Get('public/active')
  async getActiveCoupons() {
    const now = new Date();
    return await this.couponService.findAll(CouponStatus.ACTIVE).then((coupons) =>
      coupons
        .filter((c) => c.startDate <= now && c.endDate >= now)
        .map((c) => ({
          code: c.code,
          description: c.description,
          type: c.type,
          minPurchaseAmount: c.minPurchaseAmount,
          endDate: c.endDate,
        })),
    );
  }

  @Get('quick-check/:code')
  async quickCheck(@Param('code') code: string) {
    return await this.couponService.quickValidate(code);
  }
}
