import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';

@Module({
  imports: [PrismaModule],
  controllers: [RideController],
  providers: [RideService],
})
export class RideModule {}
