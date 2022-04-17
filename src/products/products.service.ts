import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsRepository } from './products.repository';
import { Product } from './product.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { NotFoundError } from 'helpers/custom-errors';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private productsRepository: ProductsRepository,
  ) {}

  private logger = new Logger(ProductsService.name);
  async getProducts(): Promise<Product[]> {
    return this.productsRepository.getProducts();
  }

  async getProductById(id: string): Promise<Product> {
    return await this.productsRepository.findOne(id);
  }

  async getProductBySlug(slug: string): Promise<Product> {
    return await this.productsRepository.findOne({ where: slug })
  }

  async getProductByCategory() {}

  async createProduct(
    createProductDto: CreateProductDto,
    imageUrl: string,
  ): Promise<void> {
    return this.productsRepository.createProduct(
      createProductDto,
      imageUrl
    );
  }

  async updateProduct(id: string, createProductDto: CreateProductDto, imageUrl: string): Promise<void> {
    return this.productsRepository.updateProduct(id, createProductDto, imageUrl);
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundError(`The product with id: ${id} cannot be found`);
    }

    this.logger.log('Product Deleted');
  }
}
