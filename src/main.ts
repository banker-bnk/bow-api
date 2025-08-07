import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { formatValidationErrors } from './helpers/validation-errors.helper';
import * as fs from 'fs';
import './instrument';

dotenv.config();

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production'
  
  const httpsOptions = isProduction ? {
    key: fs.readFileSync('/etc/letsencrypt/live/mpm.ddns.net/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/mpm.ddns.net/fullchain.pem'),
  } : null;

  const app = await NestFactory.create(AppModule, { httpsOptions, logger: ['error', 'warn', 'log', 'debug', 'verbose'] });

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: formatValidationErrors,
      disableErrorMessages: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('BOW API Documentation')
    .setDescription('API endpoints defined in the BOW NestJS project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
