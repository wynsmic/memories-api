import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './features/projects/project.module';
import { RideModule } from './features/ride/ride.module';
import { HealthModule } from './features/health/health.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CallGateway } from './features/gateway/call-gateway';
import { UserModule } from './features/user/user.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        __dirname,
        '..',
        'config',
        `.${process.env.NODE_ENV || 'development'}.env`,
      ),
    }),
    HealthModule,
    AuthModule,
    ProjectsModule,
    UserModule,
    RideModule,
  ],
  providers: [CallGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
