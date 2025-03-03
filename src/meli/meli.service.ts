import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MeliService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async getProductDetailsFromUrl(url: string): Promise<{ title: string; price: number; imageUrl: string }> {
    let productId = this.extractIdFromURL(url);

    try {
      return await this.fetchItemById(productId);
    } catch (error) {
      if (error.response?.status === 404) {
        try {
            productId = await this.handle404(url, productId);
            return await this.fetchItemById(productId);
        } catch (searchError) {
            throw new HttpException(
                `Search API fallback failed: ${searchError.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
      }

      throw new HttpException(
        `Failed to fetch product details: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async handle404(url: string, productId: string): Promise<string> {
    const slug = this.extractSlugFromUrl(url);
    if (!slug) {
        throw new HttpException('Could not extract product slug from URL', HttpStatus.BAD_REQUEST);
    }

    const searchResponse = await firstValueFrom(
        this.httpService.get(`https://api.mercadolibre.com/sites/MLA/search?q=${slug}`)
    );

    const results = searchResponse.data.results;
    if (!results || results.length === 0) {
        throw new HttpException('No products found in search results', HttpStatus.NOT_FOUND);
    }

    const matchingResult = results.find((result: any) => result.catalog_product_id === productId) || results[0];
    return matchingResult.id;
  }

  private async fetchItemById(productId: string): Promise<{ title: string; price: number; imageUrl: string }> {
    const response = await firstValueFrom(
      this.httpService.get(`https://api.mercadolibre.com/items/${productId}`)
    );
    const { title, price, pictures } = response.data;
    const imageUrl = pictures?.[0]?.url || '';
    return { title, price, imageUrl };
  }

  private extractSlugFromUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const segments = parsedUrl.pathname.split('/').filter(Boolean);

      const pIndex = segments.indexOf('p');
      if (pIndex > 0) {
        return segments[pIndex - 1].replace(/-/g, '+');
      }

      const lastSegment = segments[segments.length - 1].split(/[?#]/)[0];
      if (lastSegment && !lastSegment.startsWith('MLA') && !lastSegment.includes('.')) {
        return lastSegment.replace(/-/g, '+');
      }

      return null;
    } catch (error) {
        console.warn(`Failed to parse URL: ${url}`, error);
      return null;
    }
  }

  private extractIdFromURL(url: string): string | null {
    try {
      if (!url || typeof url !== 'string') {
        return null;
      }
  
      const patterns = [
        { regex: /\/(MLA-\d+)/, transform: (match: string) => match.replace(/-/g, '') },
        { regex: /\/p\/([A-Z0-9]+)/, transform: (match: string) => match },
        { regex: /item_id:([A-Z0-9]+)/, transform: (match: string) => match },
        { regex: /wid=([^&#]+)/, transform: (match: string) => match },
      ];
  
      for (const pattern of patterns) {
        const match = url.match(pattern.regex);
        if (match && match[1]) {
          return pattern.transform(match[1]);
        }
      }
  
      console.warn(`Could not extract ID from URL: ${url}`);
      return null;
    } catch (error) {
      console.error(`Error extracting ID from URL: ${error}`);
      return null;
    }
  }
}
