import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MeliService } from './meli.service';
import { MeliController } from './meli.controller';

@Module({
  imports: [HttpModule,], // Register the entity here
  providers: [MeliService],
  controllers: [MeliController],
})
export class MeliModule {}
