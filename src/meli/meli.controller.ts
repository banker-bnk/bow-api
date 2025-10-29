import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MeliService } from './meli.service';

@Controller('meli')
export class MeliController {
  constructor(
    private readonly meliService: MeliService,
  ) {}

  @Get('preview')
  @ApiOperation({
    description: 'Preview the product details (price and image) from a Mercado Libre URL without creating a gift.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the product price and image URL.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        price: { type: 'number' },
        imageUrl: { type: 'string' },
      },
    },
  })
  async previewProductDetails(@Query('mercadolibreUrl') mercadolibreUrl: string) {
    return this.meliService.getProductDetailsFromUrl(mercadolibreUrl);
  }
}
