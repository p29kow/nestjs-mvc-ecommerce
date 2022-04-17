import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { createOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Res } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { InternalServerErrorInterceptor } from '../common/interceptors/internal-server-error.interceptor';

@Controller('orders')
export class OrdersController {
  constructor(private ordersSevice: OrdersService) {}


  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/total-sales')
  getTotalSales() {
    return this.ordersSevice.getTotalSales();
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/:id')
  getOrderById(@Param() id: string): Promise<Order> {
    return this.ordersSevice.getOrderById(id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('admin/edit-order')
  @Get('/edit-order/:id')
  async getEditOrderPage(@Param() id: string) {
    const order = await this.ordersSevice.getOrderById(id);
    
    return {
      order,
      title: 'Edit Order'
    }
  }

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(InternalServerErrorInterceptor)
  @Post()
  createOrder(
    @Req() req,
    @Res() res,
    @Body() createOrderDto: createOrderDto,
  ): Promise<void> {
    req.flash('orderSuccess', 'Your order has been placed');
    res.redirect('/');
    return this.ordersSevice.createOrder(req.user, createOrderDto);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put()
  editOrder(
    @Param() id: string,
    @Body() createOrderDto: createOrderDto,
  ): Promise<void> {
    return this.ordersSevice.editOrder(id, createOrderDto);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('/:id/status')
  updateOrderStatus(
    @Param() id: string,
    @Body() createOrderDto: createOrderDto,
  ): Promise<Order> {
    return this.ordersSevice.updateOrderStatus(id, createOrderDto);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  deleteOrder(@Param() id: string): Promise<void> {
    return this.ordersSevice.deleteOrder(id);
  }
}
