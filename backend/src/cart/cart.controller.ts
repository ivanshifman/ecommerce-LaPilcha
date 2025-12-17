import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';
import { AddToCartDto } from './dto/add-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { CART_COOKIE } from '../common/utils/cookie.util';
import { getCookieCart } from 'src/common/utils/request.util';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as AuthenticatedUserDto | undefined;
    const anonymousId = getCookieCart(req, CART_COOKIE);

    return this.cartService.getCart(user?.id, anonymousId, res);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('items')
  async addToCart(
    @Body() dto: AddToCartDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as AuthenticatedUserDto | undefined;
    const anonymousId = getCookieCart(req, CART_COOKIE);

    return this.cartService.addToCart(dto, user?.id, anonymousId, res);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch('items')
  async updateCartItem(
    @Body() dto: UpdateCartItemDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as AuthenticatedUserDto | undefined;
    const anonymousId = getCookieCart(req, CART_COOKIE);

    return this.cartService.updateCartItem(dto, user?.id, anonymousId, res);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete('items')
  @HttpCode(HttpStatus.OK)
  async removeFromCart(
    @Body() dto: RemoveCartItemDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as AuthenticatedUserDto | undefined;
    const anonymousId = getCookieCart(req, CART_COOKIE);

    return this.cartService.removeFromCart(dto, user?.id, anonymousId, res);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearCart(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto | undefined;
    const anonymousId = getCookieCart(req, CART_COOKIE);

    return this.cartService.clearCart(user?.id, anonymousId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('merge')
  @HttpCode(HttpStatus.OK)
  async mergeCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as AuthenticatedUserDto;
    const anonymousId = getCookieCart(req, CART_COOKIE);

    return this.cartService.mergeAnonymousCart(user.id, anonymousId, res);
  }
}
