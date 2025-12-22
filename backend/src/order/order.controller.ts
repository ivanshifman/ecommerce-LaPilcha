import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { MongoIdDto } from '../common/dto/mongo-id.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto, UpdateOrderStatusDto, UpdateShippingDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UserRole } from '../user/common/enums/userRole.enum';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.orderService.createOrder(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req: Request, @Query() query: OrderQueryDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.orderService.getMyOrders(user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders/:id')
  async getMyOrder(@Req() req: Request, @Param() params: MongoIdDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.orderService.getOrderById(params.id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my-orders/:id/cancel')
  async cancelMyOrder(
    @Req() req: Request,
    @Param() params: MongoIdDto,
    @Body() dto: CancelOrderDto,
  ) {
    const user = req.user as AuthenticatedUserDto;
    return await this.orderService.cancelOrder(params.id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllOrders(@Query() query: OrderQueryDto) {
    return await this.orderService.getAllOrders(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getOrderByIdAdmin(@Param() params: MongoIdDto) {
    return await this.orderService.getOrderById(params.id, '', true);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  async updateOrderStatus(
    @Req() req: Request,
    @Param() params: MongoIdDto,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const admin = req.user as AuthenticatedUserDto;
    return await this.orderService.updateOrderStatus(params.id, admin.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/shipping')
  async updateShippingInfo(@Param() params: MongoIdDto, @Body() dto: UpdateShippingDto) {
    return await this.orderService.updateShippingInfo(params.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/confirm-return')
  async confirmProductReturn(@Param() params: MongoIdDto) {
    return await this.orderService.confirmProductReturn(params.id);
  }
}
