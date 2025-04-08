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
        this.httpService.post(`${process.env.MELI_API_HOST}/oauth/token`, {
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

  private async scrapePriceFromUrl(url: string): Promise<{ title: string; price: number; imageUrl: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        })
      );

      const html = response.data;
      
      // Extract JSON-LD data from the HTML
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      if (!jsonLdMatch) {
        throw new HttpException('Could not find JSON-LD data in page', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const jsonLdData = JSON.parse(jsonLdMatch[1]);
      
      if (!jsonLdData.name || !jsonLdData.offers?.price || !jsonLdData.image) {
        throw new HttpException('Missing required product information in JSON-LD data', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        title: jsonLdData.name,
        price: jsonLdData.offers.price,
        imageUrl: jsonLdData.image
      };
    } catch (error) {
      console.error(`[MELI] Scraping error:`, error.message);
      throw new HttpException(
        `Failed to scrape product data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProductDetailsFromUrl(url: string): Promise<{ title: string; price: number; imageUrl: string }> {
    try {
      const productId = this.extractIdFromURL(url);
      console.log(`[MELI] Attempting to fetch product with ID: ${productId}`);
      
      if (!productId) {
        throw new HttpException('Invalid product URL', HttpStatus.BAD_REQUEST);
      }

      try {
        return await this.fetchProductById(productId);
      } catch (error) {
        if (error.response?.status === 404) {
          try {
            console.log(`[MELI] Product not found, falling back to search`);
            const newProductId = await this.searchProduct(url);
            console.log(`[MELI] Found new product ID from search: ${newProductId}`);
            return await this.fetchProductById(newProductId);
          } catch (searchError) {
            console.log(`[MELI] Search failed, falling back to scraping`);
            return await this.scrapePriceFromUrl(url);
          }
        }
        throw error;
      }
    } catch (error) {
      console.log(`[MELI] All methods failed, falling back to scraping`);
      return await this.scrapePriceFromUrl(url);
    }
  }

  private async searchProduct(url: string): Promise<string> {
    const productId = this.extractIdFromURL(url);
    if (!productId) {
      throw new HttpException('Could not extract product ID from URL', HttpStatus.BAD_REQUEST);
    }

    const token = await this.getAccessToken();
    
    // Try to get the product directly by ID
    try {
      await firstValueFrom(
        this.httpService.get(`${process.env.MELI_API_HOST}/products/MLA${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      return `MLA${productId}`;
    } catch (error) {
      // If direct fetch fails, try search with the product ID
      const searchUrl = `${process.env.MELI_API_HOST}/products/search?site_id=MLA&q=${encodeURIComponent(productId)}&limit=1`;
      
      const searchResponse = await firstValueFrom(
        this.httpService.get(searchUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );

      const results = searchResponse.data.results;
      if (!results || results.length === 0) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }

      return results[0].id;
    }
  }

  private async fetchProductById(productId: string): Promise<{ title: string; price: number; imageUrl: string }> {
    const token = await this.getAccessToken();
    const response = await firstValueFrom(
      this.httpService.get(`${process.env.MELI_API_HOST}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );

    const { name, buy_box_winner, pictures } = response.data;
    
    if (!name || !buy_box_winner?.price || !pictures?.[0]?.url) {
      throw new HttpException('Missing required product information', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      title: name,
      price: buy_box_winner.price,
      imageUrl: pictures[0].url
    };
  }

  private extractSlugFromUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const segments = parsedUrl.pathname.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      return lastSegment || null;
    } catch (error) {
      console.warn(`Failed to parse URL: ${url}`, error);
      return null;
    }
  }

  private extractIdFromURL(url: string): string | null {
    // Handle /p/MLA format
    const pMatch = url.match(/\/p\/(MLA\d+)/);
    if (pMatch) return pMatch[1];

    // Handle MLA- format
    const mlaMatch = url.match(/MLA-(\d+)/);
    if (mlaMatch) return `MLA${mlaMatch[1]}`;

    // Handle wid= format
    const widMatch = url.match(/wid=MLA(\d+)/);
    if (widMatch) return `MLA${widMatch[1]}`;

    return null;
  }
}
