import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  app.enableCors({
    origin: ['https://memories-ui-jet.vercel.app', 'http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3002;

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.warn(`App is running under ${process.env.NODE_ENV} environment`);
  logger.log(`App is running on: http://localhost:${port}`);
}

void bootstrap();
