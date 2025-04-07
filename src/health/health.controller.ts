import { Controller, Get } from '@nestjs/common';

@Controller('hb')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
