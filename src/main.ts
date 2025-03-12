import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { formatValidationErrors } from './helpers/validation-errors.helper';
import * as fs from 'fs';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    //key: fs.readFileSync('/etc/letsencrypt/live/mpm.ddns.net/privkey.pem'),
    //cert: fs.readFileSync('/etc/letsencrypt/live/mpm.ddns.net/fullchain.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

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

  await app.listen(process.env.PORT);
}
bootstrap();
