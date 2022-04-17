import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import slugify from 'slugify';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
    private logger = new Logger(CategoriesRepository.name);
    async createCategory(createCategoryDto: CreateCategoryDto, imageUrl: string): Promise<void> {
        const { name } = createCategoryDto;
        const slug = slugify(name, { lower: true })
        const category = this.create({ name, slug, imageUrl });

        try {
            await this.save(category);
            this.logger.log('Category Saved');
        } catch(error) {
            if(error.code === '23505') {
                throw new ConflictException('This category already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }     
    }
    async getCategories(): Promise<Category[]> {
        const query = this.createQueryBuilder('categories');
        try {
            const categories = await query.getMany();
            return categories;
        } catch(error) {
            this.logger.error('Failed to get categories');
        }
    }

    async updateCategory(id: string, createCategoryDto: CreateCategoryDto, imageUrl: string): Promise<void> {
        const query = this.createQueryBuilder('categories');
        const { name } = createCategoryDto;
        const slug = slugify(name, { lower: true })
        try {
            await query.update(Category).set({name, imageUrl, slug }).where(id).execute();
        } catch(error) {
            this.logger.error(`Could not update category with ID: ${id} `);
        }
    }
}