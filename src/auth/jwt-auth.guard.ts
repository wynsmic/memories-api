import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
      this.logger.warn('Auth error:', err);
      this.logger.warn('Auth info:', info);
      throw new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
