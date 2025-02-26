import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from './entities/gift';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import getMeliId from '../helpers/meli-getId';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private giftsRepository: Repository<Gift>,
    private readonly httpService: HttpService,
  ) {}

  async findByUserId(userId: number): Promise<Gift> {
    return this.giftsRepository.findOne({
      where: { 
        user: { id: userId },
        active: true 
      },
      relations: ['user'],
      order: { id: 'DESC' } // Order by ID descending to get the highest ID
    });
  }

  async previewProductDetails(mercadolibreUrl: string): Promise<{ price: number; imageUrl: string }> {
    const { price, imageUrl } = await this.fetchProductDetails(mercadolibreUrl);
    return { price, imageUrl };
  }

  async create(data: Partial<Gift>): Promise<Gift> {
    const { price, imageUrl } = await this.fetchProductDetails(data.link);
    data.price = price;
    data.image = imageUrl; // Set image URL
    const gift = this.giftsRepository.create(data);
    return this.giftsRepository.save(gift);
  }

  async update(id: number, data: Partial<Gift>): Promise<Gift> {
    await this.giftsRepository.update(id, data);
    return this.giftsRepository.findOneBy({ id });
  }

  async delete(data: { id: number; user: number }) {
    const gift = await this.giftsRepository.findOne({
      where: { id: data.id },
      relations: ['user'],
    });

    if (!gift) {
      throw new Error('Gift not found');
    }

    if (gift.user.id !== data.user) {
      throw new Error('This gift does not belong to the specified user');
    }

    await this.giftsRepository.remove(gift);
  }

  async findById(id: number) {
    const gift = await this.giftsRepository
      .createQueryBuilder('gift')
      .leftJoinAndSelect('gift.giftsPayments', 'giftsPayments')
      .leftJoinAndSelect('giftsPayments.user', 'user')
      .select([
        'gift',
        'giftsPayments.amount',
        'user.id',
        'user.userName',
        'user.lastName',
        'user.image',
      ])
      .where('gift.id = :id', { id })
      .getOne();

    if (!gift) {
      throw new NotFoundException(`Gift with ID ${id} not found`);
    }

    const totalAmount = gift.giftsPayments
      .reduce((sum, payment) => {
        return sum + Number(payment.amount);
      }, 0)
      .toFixed(2);

    return {
      ...gift,
      totalAmount,
    };
  }

  private async fetchProductDetails(link: string): Promise<{ price: number, imageUrl: string }> {
    const productId = getMeliId(link);

    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.mercadolibre.com/items/${productId}`)
      );

      if (response.status === 200) {
        const price = response.data.price;
        const imageUrl = response.data.pictures?.[0]?.url || ''; // Default to empty string if no image
        return { price, imageUrl };
      }

      throw new HttpException(
        'Failed to fetch product details from Mercado Libre',
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      throw new HttpException(
        `Error while fetching product details: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
