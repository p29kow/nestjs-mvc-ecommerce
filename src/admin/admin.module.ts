import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { AdminController } from './admin.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [ProductsModule, CategoriesModule, OrdersModule],
  controllers: [AdminController]
})
export class AdminModule {}
