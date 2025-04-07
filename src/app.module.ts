import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './features/projects/project.module';
import { RideModule } from './features/ride/ride.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/.${process.env.NODE_ENV || 'development'}.env`,
    }),
    HealthModule,
    AuthModule,
    ProjectsModule,
    RideModule,
  ],
})
export class AppModule {}
