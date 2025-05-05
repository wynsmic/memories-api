import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedRequest } from './types/authenticated-request';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async syncUser(
    @Request() req: AuthenticatedRequest,
    @Body()
    body: { firstname: string; lastname: string; email: string; phone: string },
  ) {
    const sub = req.user.userId;
    const email = req.user.email;
    const user = await this.authService.syncUser({ ...body, sub, email });
    return { id: user.id };
  }
}
