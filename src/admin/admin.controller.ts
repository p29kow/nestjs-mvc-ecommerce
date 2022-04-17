import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { ProductsService } from '../products/products.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/order-status.enum';

@Controller('admin')
export class AdminController {
  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
  ) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @Render('admin/dashboard')
  async getDashboard() {
    const orders = await this.ordersService.getOrders(OrderStatus.PENDING);
    return {
      title: 'Dashboard',
      orders,
    };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('products')
  @Render('admin/products')
  async getProducts() {
    const products = await this.productsService.getProducts();
    return {
      products,
      title: 'Products',
    };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('orders-being-processed')
  @Render('admin/orders-being-processed')
  async getOrdersBeingProcessed() {
    const orders = await this.ordersService.getOrders(OrderStatus.PROCESSING);
    return {
      title: 'Orders Being Processed',
      orders,
    };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('delivered-orders')
  @Render('admin/delivered-orders')
  async getDeliveredOrders() {
    const orders = await this.ordersService.getOrders(OrderStatus.DELIVERED);
    return {
      title: 'Past Orders',
      orders,
    };
  }
}
