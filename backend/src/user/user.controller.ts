import { Controller, Get, Patch, UseGuards, Body, Param, Delete, Post, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from './common/enums/userRole.enum';
import { UserDocument } from './schemas/user.schema';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private users: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.users.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.users.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UserDocument) {
    return await this.users.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.users.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wishlist')
  async getWishlist(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto;
    return await this.users.getWishlist(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wishlist/:productId')
  async addToWishlist(@Req() req: Request, @Param('productId') productId: string) {
    const user = req.user as AuthenticatedUserDto;
    return await this.users.addToWishlist(user.id, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('wishlist/:productId')
  async removeFromWishlist(@Req() req: Request, @Param('productId') productId: string) {
    const user = req.user as AuthenticatedUserDto;
    return await this.users.removeFromWishlist(user.id, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('wishlist')
  async clearWishlist(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto;
    return { success: true, wishlist: await this.users.clearWishlist(user.id) };
  }
}
