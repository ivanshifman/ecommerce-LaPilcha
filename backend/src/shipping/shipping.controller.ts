import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ShippingService } from './shipping.service';
import { ShippingCalculatorService } from './shipping-calculator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/common/enums/userRole.enum';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { MongoIdDto, OrderIdDto } from '../common/dto/mongo-id.dto';
import {
  CreateShippingDto,
  UpdateShippingStatusDto,
  UpdateTrackingDto,
  CalculateShippingDto,
  CreateShippingRateDto,
} from './dto/shipping.dto';
import { ShippingStatus, ShippingZone, ShippingMethod } from './enums/shipping.enum';

@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
    private readonly calculatorService: ShippingCalculatorService,
  ) {}

  @Post('calculate')
  async calculateShipping(@Body() dto: CalculateShippingDto) {
    return await this.calculatorService.calculateShipping(dto.province, dto.subtotal, dto.weight);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  async getShippingByOrder(@Param() params: OrderIdDto) {
    return await this.shippingService.getShippingByOrderId(params.orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createShipping(@Req() req: Request, @Body() dto: CreateShippingDto) {
    return await this.shippingService.createShipping(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllShippings(@Query('status') status?: ShippingStatus) {
    return await this.shippingService.getAllShippings(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('pending')
  async getPendingShippings() {
    return await this.shippingService.getPendingShippings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getShippingById(@Param() params: MongoIdDto) {
    return await this.shippingService.getShippingById(params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  async updateShippingStatus(
    @Req() req: Request,
    @Param() params: MongoIdDto,
    @Body() dto: UpdateShippingStatusDto,
  ) {
    const admin = req.user as AuthenticatedUserDto;
    return await this.shippingService.updateShippingStatus(params.id, dto, admin.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/tracking')
  async updateTracking(@Param() params: MongoIdDto, @Body() dto: UpdateTrackingDto) {
    return await this.shippingService.updateTracking(params.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('generate-tracking')
  generateTrackingNumber() {
    const trackingNumber = this.shippingService.generateTrackingNumber();
    return { trackingNumber };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('rates/all')
  async getAllRates() {
    return await this.calculatorService.getAllRates();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('rates')
  async createOrUpdateRate(@Body() dto: CreateShippingRateDto) {
    return await this.calculatorService.createOrUpdateRate(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('rates/:zone/:method/toggle')
  async toggleRateStatus(
    @Param('zone') zone: ShippingZone,
    @Param('method') method: ShippingMethod,
  ) {
    return await this.calculatorService.toggleRateStatus(zone, method);
  }
}
