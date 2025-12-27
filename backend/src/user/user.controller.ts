import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Body,
  Param,
  Delete,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../cart/guards/optional-jwt-auth.guard';
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
    private readonly userService: UserService,
    private readonly wishlistService: WishlistService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('me/wishlist')
  async getMyWishlist(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto | undefined;
    return await this.wishlistService.getWishlist(user?.id, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('me/wishlist/:productId')
  async addToMyWishlist(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param() params: ProductIdDto,
  ) {
    const user = req.user as AuthenticatedUserDto | undefined;
    return await this.wishlistService.addToWishlist(params.productId, user?.id, req, res);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete('me/wishlist/:productId')
  async removeFromMyWishlist(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param() params: ProductIdDto,
  ) {
    const user = req.user as AuthenticatedUserDto | undefined;
    return await this.wishlistService.removeFromWishlist(params.productId, user?.id, req, res);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete('me/wishlist')
  async clearWishlist(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as AuthenticatedUserDto | undefined;
    return await this.wishlistService.clearWishlist(user?.id, res);
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
