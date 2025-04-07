import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, originalUrl, body } = req;
    const start = Date.now();

    this.logger.log(`➡️ ${method} ${originalUrl}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(`📦 Request Body: ${JSON.stringify(body)}`);
    }

    const originalSend = res.send.bind(res);
    res.send = (data) => {
      const elapsed = Date.now() - start;
      this.logger.log(`⬅️ ${method} ${originalUrl} (${elapsed}ms)`);
      this.logger.debug(`📤 Response: ${data}`);
      return originalSend(data);
    };

    next();
  }
}
