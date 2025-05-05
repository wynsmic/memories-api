import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSyncDto } from './dto/auth-sync.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private async findProvider(providerUserId: string, provider: string) {
    return await this.prisma.authProvider.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      include: { user: true },
    });
  }

  async syncUser(dto: AuthSyncDto) {
    const { sub, email, firstname, lastname, phone } = dto;
    const provider = 'google';
    const authProvider = await this.findProvider(sub, provider);
    if (!authProvider) {
      const user = await this.prisma.user.create({
        data: {
          email,
          firstname,
          lastname,
          phone,
          authProviders: {
            create: {
              provider,
              providerUserId: sub,
            },
          },
        },
      });
      return user;
    }

    return authProvider.user;
  }

  async findUser(sub: string) {
    const provider = 'google';
    const authProvider = await this.findProvider(sub, provider);

    if (!authProvider) {
      return null;
    }

    return authProvider.user;
  }
}
