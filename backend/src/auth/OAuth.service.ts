import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { OAuthUserDto } from './dto/o-auth-user.dto';
import { UserMapper } from '../common/mappers/user.mapper';

@Injectable()
export class OAuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async oauthLogin(dto: OAuthUserDto) {
    const existing = await this.userService.findByEmail(dto.email);

    if (existing) {
      if (!existing.isActive) {
        throw new UnauthorizedException('Usuario desactivado');
      }

      if (existing.authProvider !== dto.authProvider) {
        throw new BadRequestException(
          `Este email ya está registrado con otro método de autenticación. Por favor inicia sesión con tu método original.`,
        );
      }

      existing.lastLogin = new Date();
      await existing.save();

      const userDto = UserMapper.toAuthenticatedDto(existing);
      const tokens = await this.tokenService.createTokensForUser(userDto);
      return { user: userDto, ...tokens };
    }

    const userDto = await this.userService.createOAuthUser({
      provider: dto.authProvider,
      providerId: dto.providerId,
      email: dto.email,
      name: dto.name,
      lastName: dto.lastName,
      avatar: dto.avatar,
    });

    const authenticatedUser: AuthenticatedUserDto = {
      id: userDto.id,
      email: userDto.email,
      role: userDto.role,
      emailVerified: userDto.emailVerified,
    };

    const tokens = await this.tokenService.createTokensForUser(authenticatedUser);
    return { user: authenticatedUser, ...tokens };
  }
}
