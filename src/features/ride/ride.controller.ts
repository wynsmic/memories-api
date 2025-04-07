// Example controller
import { Controller, Delete, Post } from '@nestjs/common';
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

  @Post('update')
  async updateRide(ride: RideData) {
    return await this.rideService.updateRideData(ride);
  }
}
