import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MeliService } from './meli.service';

@Controller('meli')
export class MeliController {
  constructor(
    private readonly meliService: MeliService,
  ) {}

  private extractMercadoLibreUrl(input: string): string {
    // Extract URL from pasted text (handles cases where users paste text like "I've found this product in Mercado Libre! https://...")
    const urlPattern = /https?:\/\/[^\s<>"']+/i;
    const match = input.match(urlPattern);
    return match ? match[0] : input;
  }

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
    const cleanUrl = this.extractMercadoLibreUrl(mercadolibreUrl);
    return this.meliService.getProductDetailsFromUrl(cleanUrl);
  }
}
