import { Controller, Get, Patch, UseGuards, Body, Param, Delete, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from './user.service';
import { WishlistService } from './wishList.service';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { UpdateUserAdminDto } from './dto/update-user.dto';
import { UserResponseDto } from '../auth/dto/auth-response.dto';
import { MongoIdDto, ProductIdDto } from '../common/dto/mongo-id.dto';
import { UserRole } from './common/enums/userRole.enum';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private wishlistService: WishlistService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/wishlist')
  async getMyWishlist(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto;
    return await this.wishlistService.getWishlist(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/wishlist/:productId')
  async addToMyWishlist(@Req() req: Request, @Param() params: ProductIdDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.wishlistService.addToWishlist(user.id, params.productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/wishlist/:productId')
  async removeFromMyWishlist(@Req() req: Request, @Param() params: ProductIdDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.wishlistService.removeFromWishlist(user.id, params.productId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('me/wishlist')
  async clearMyWishlist(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto;
    return await this.wishlistService.clearWishlist(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.userService.findAllAsDto();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param() params: MongoIdDto) {
    return await this.userService.findByIdAsDto(params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() params: MongoIdDto,
    @Body() body: UpdateUserAdminDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateUserAdmin(params.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteUser(@Param() params: MongoIdDto) {
    return await this.userService.delete(params.id);
  }
}
