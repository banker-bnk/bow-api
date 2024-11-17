import { Controller, Get, Post, Body } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { Gift } from './entities/gift';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get()
  findAll() {
    return this.giftsService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Gift>) {
    return this.giftsService.create(data);
  }
}
