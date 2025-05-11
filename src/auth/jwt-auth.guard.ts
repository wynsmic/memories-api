import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    this.logger.log('Authorization header:', request.headers.authorization);
    this.logger.log('Audience: ', process.env.AUTH0_AUDIENCE);
    this.logger.log('Issuer: ', process.env.AUTH0_ISSUER);
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
      if (err) {
        this.logger.warn('Auth error:', err);
      }
      if (!user) {
        this.logger.warn('No user found');
      }
      this.logger.warn('Auth info:', info);
      throw new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
