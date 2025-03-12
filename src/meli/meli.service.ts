import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MeliService {
  private accessToken: string | null = null;
  private tokenExpiration: Date | null = null;

  constructor(
    private readonly httpService: HttpService,
  ) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiration && this.tokenExpiration > new Date()) {
      return this.accessToken;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${process.env.MELI_API_HOST}${process.env.MELI_AUTH_PATH}`, {
          grant_type: 'client_credentials',
          client_id: process.env.MELI_CLIENT_ID,
          client_secret: process.env.MELI_CLIENT_SECRET
        })
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiration = new Date(Date.now() + (response.data.expires_in * 1000) - 300000);
      
      return this.accessToken;
    } catch (error) {
      throw new HttpException(
        `Failed to obtain access token: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

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

    const token = await this.getAccessToken();
    const searchResponse = await firstValueFrom(
        this.httpService.get(`${process.env.MELI_API_HOST}${process.env.MELI_SEARCH_PATH}?q=${slug}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
    );

    const results = searchResponse.data.results;
    if (!results || results.length === 0) {
        throw new HttpException('No products found in search results', HttpStatus.NOT_FOUND);
    }

    const matchingResult = results.find((result: any) => result.catalog_product_id === productId) || results[0];
    return matchingResult.id;
  }

  private async fetchItemById(productId: string): Promise<{ title: string; price: number; imageUrl: string }> {
    const token = await this.getAccessToken();
    const response = await firstValueFrom(
      this.httpService.get(`${process.env.MELI_API_HOST}${process.env.MELI_ITEMS_PATH}/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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
