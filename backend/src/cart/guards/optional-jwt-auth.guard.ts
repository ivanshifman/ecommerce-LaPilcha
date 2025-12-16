import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt-opcional') {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser | undefined {
    return user ?? undefined;
  }
}
