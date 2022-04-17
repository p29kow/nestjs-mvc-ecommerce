import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { MainController } from './main.controller';

@Module({
    imports: [ProductsModule, CategoriesModule, CartModule],
    controllers: [MainController]
})
export class MainModule {}
