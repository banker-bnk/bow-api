import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/debug-sentry")
  getError() {
    Logger.log("Getting error");
    throw new Error("My first Sentry error!");
  }

}
