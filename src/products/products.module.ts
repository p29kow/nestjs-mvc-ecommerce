import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { CategoriesService } from '../categories/categories.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductsRepository]), CategoriesModule],
    providers: [ProductsService, CategoriesService],
    controllers: [ProductsController],
    exports: [ProductsService, TypeOrmModule]
})
export class ProductsModule {}
