import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common/interfaces';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy, OnApplicationShutdown
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();

    const client = this as unknown as {
      _request: (args: unknown) => Promise<unknown>;
    };

    const originalRequest = client._request.bind(client);

    client._request = async (args: unknown): Promise<unknown> => {
      try {
        return await originalRequest(args);
      } catch (err) {
        if (
          err instanceof PrismaClientUnknownRequestError &&
          err.message.includes('prepared statement') &&
          err.message.includes('does not exist')
        ) {
          this.logger.error(
            'Fatal Prisma error: prepared statement issue detected. Exiting process.',
            err.stack,
          );
          await this.$disconnect();
          process.exit(1);
        }

        if (
          err instanceof PrismaClientUnknownRequestError &&
          err.message.includes('prepared statement') &&
          err.message.includes('already exists')
        ) {
          this.logger.error(
            'Fatal Prisma prepared statement conflict. Restarting app...',
            err.stack,
          );
          await this.$disconnect();
          //process.exit(1);
        }

        throw err;
      }
    };
  }
  async onModuleInit() {
    await this.$connect();

    // Optional: auto-run migrations if needed
    try {
      console.log('Running Prisma migrations...');
      await execAsync('npx prisma migrate deploy'); // deploys any pending migrations
      console.log('Migrations applied successfully');
    } catch (err) {
      console.error('Error running migrations', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
