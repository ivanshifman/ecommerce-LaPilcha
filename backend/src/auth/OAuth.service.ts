import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { OAuthUserDto } from './dto/o-auth-user.dto';

@Injectable()
export class OAuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  toDto(user: UserDocument): AuthenticatedUserDto {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }

  async oauthLogin(dto: OAuthUserDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing && existing.authProvider !== dto.authProvider) {
      throw new BadRequestException(`Email ya registrado con ${existing.authProvider}`);
    }

    const user = await this.userService.createOAuthUser({
      provider: dto.authProvider,
      providerId: dto.providerId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
    });

    const userDto = this.toDto(user);
    const tokens = await this.tokenService.createTokensForUser(userDto);

    return { user: userDto, ...tokens };
  }
}
