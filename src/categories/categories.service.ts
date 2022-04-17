import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'helpers/custom-errors';
import { CategoriesRepository } from './categories.repository';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(CategoriesRepository) private categoriesRepository: CategoriesRepository) {}
    
    private logger = new Logger(CategoriesService.name);

    async getCategories(): Promise<Category[]> {
        return this.categoriesRepository.getCategories();
    }

    async getCategoryById(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne(id);
        this.logger.log('Category found');
        if(!category) {
            throw new NotFoundError(`Category with ID: ${id} cannot be found`);
        }

        return category;
    }

    createCategory(createCategoryDto: CreateCategoryDto, imageUrl: string): Promise<void> {
        return this.categoriesRepository.createCategory(createCategoryDto, imageUrl);
    }

    async updateCategory(id: string, createCategoryDto: CreateCategoryDto, imageUrl) : Promise<void> {
        return await this.categoriesRepository.updateCategory(id, createCategoryDto, imageUrl);
    }

    async deleteCategory(id: string): Promise<void> {
        const category = await this.categoriesRepository.delete(id);
        this.logger.log('Category deleted');

        if(category.affected === 0) {
            throw new NotFoundError(`Could not delete category with ID: ${id}`);

        }
    }


}
