import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Category } from '../categories/category.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { Product } from './product.entity';
import slugify from 'slugify';

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product> {
  private logger = new Logger(ProductsRepository.name);
  async getProducts(): Promise<Product[]> {
    const query = this.createQueryBuilder('products');
    try {
      const products = await query.getMany();
      return products;
    } catch (error) {
      this.logger.error('Could not get products');
    }
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imageUrl: string,
  ): Promise<void> {
    const { name, description, price, categoryId } = createProductDto;
    const slug = slugify(name, { lower: true })

    const category = await getRepository(Category).findOne(categoryId);
    try {
      const product = await this.create({
        name,
        description,
        price,
        imageUrl,
        category,
        slug
      });

      await this.save(product);

      this.logger.log('Product Saved');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateProduct(
    id: string,
    createProductDto: CreateProductDto,
    imageUrl: string,
  ): Promise<void> {
    const query = this.createQueryBuilder('products');
    const { name, description, price, categoryId } = createProductDto;
    const slug = slugify(name, { lower: true });
    const category = await getRepository(Category).findOne(categoryId);

    try {
      await query
        .update(Product)
        .set({ name, description, price, imageUrl, category, slug })
        .where(id)
        .execute();
      this.logger.log('Update successful');
    } catch (error) {
      this.logger.error(`Could not update product with ID: ${id} `);
    }
  }
}
