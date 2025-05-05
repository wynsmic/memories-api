import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserByPhone(phone: string) {
    return await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });
  }

  async createUser(data: {
    firstname: string;
    lastname: string;
    email?: string;
    phone: string;
  }) {
    return this.prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
      },
    });
  }
}
