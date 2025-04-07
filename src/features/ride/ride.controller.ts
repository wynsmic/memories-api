// Example controller
import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { RideData, RideService } from './ride.service';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('load')
  async loadRide() {
    return await this.rideService.loadRideData();
  }

  @Delete('clean')
  async cleanRide() {
    return await this.rideService.cleanRideData();
  }

  @Patch('patch')
  async patchRide(@Body() dataToPatch: Partial<RideData>) {
    return await this.rideService.patchRideData(dataToPatch);
  }
}
