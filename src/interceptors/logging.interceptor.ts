import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, body } = request;
    const userAgent = request.headers['user-agent'] || 'unknown';
    const user = (request as any).user; // Extract user from request if available
    const userId = user?.sub || user?.id || 'anonymous';

    const startTime = Date.now();

    // Prepare body string for logging, only if present and not empty
    let bodyString = '';
    if (body && Object.keys(body).length > 0) {
      try {
        bodyString = ` | Body: ${JSON.stringify(body)}`;
      } catch (e) {
        bodyString = ' | Body: [unserializable]';
      }
    }

    this.logger.log(
      `Incoming ${method} request to ${url} from ${ip} (User: ${userId}, User-Agent: ${userAgent})${bodyString}`
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `Completed ${method} ${url} in ${duration}ms (User: ${userId})`
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Failed ${method} ${url} in ${duration}ms (User: ${userId}) - ${error.message}`,
            error.stack
          );
        },
      })
    );
  }
} 