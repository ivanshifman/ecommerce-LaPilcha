import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OptionalJwtAuthGuard } from '../cart/guards/optional-jwt-auth.guard';
import { ReturnService } from './return.service';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { CreateReturnDto } from './dto/create-return.dto';
import { ApproveReturnDto, RejectReturnDto, InspectReturnDto } from './dto/update-return.dto';
import { MongoIdDto } from '../common/dto/mongo-id.dto';
import { UserRole } from '../user/common/enums/userRole.enum';
import { ReturnStatus } from './enums/return-status.enum';

@Controller('returns')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async createReturn(@Body() dto: CreateReturnDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUserDto | undefined;
    return await this.returnService.createReturn(dto, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-returns')
  async getMyReturns(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto;
    return await this.returnService.getMyReturns(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getReturnById(@Req() req: Request, @Param() params: MongoIdDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.returnService.getReturnById(params.id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/all')
  async getAllReturns(@Query('status') status?: ReturnStatus) {
    return await this.returnService.getAllReturns(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/:id')
  async getReturnByIdAdmin(@Param() params: MongoIdDto) {
    return await this.returnService.getReturnById(params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/approve')
  async approveReturn(
    @Param() params: MongoIdDto,
    @Body() dto: ApproveReturnDto,
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUserDto;
    return await this.returnService.approveReturn(params.id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/reject')
  async rejectReturn(
    @Param() params: MongoIdDto,
    @Body() dto: RejectReturnDto,
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUserDto;
    return await this.returnService.rejectReturn(params.id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/received')
  async markAsReceived(
    @Param() params: MongoIdDto,
    @Body() body: { trackingNumber?: string },
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUserDto;
    return await this.returnService.markAsReceived(params.id, user.id, body.trackingNumber);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/inspect')
  async inspectReturn(
    @Param() params: MongoIdDto,
    @Body() dto: InspectReturnDto,
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUserDto;
    return await this.returnService.inspectReturn(params.id, user.id, dto);
  }
}
