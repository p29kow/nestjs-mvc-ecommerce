import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order-status.enum';
import { Order } from './order.entity';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository,
  ) {}

  async createOrder(user, createOrderDto: createOrderDto): Promise<void> {
    return this.ordersRepository.createOrder(user, createOrderDto);
  }

  async getOrders(orderStatus: OrderStatus): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: { status: orderStatus },
    });
    return orders;
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne(id);
    return order;
  }

  async editOrder(id: string, createOrderDto: createOrderDto): Promise<void> {
    const { address, contact, status, paymentStatus, userId } = createOrderDto;
    await this.ordersRepository.update(id, {
      address,
      contact,
      userId,
      status,
      paymentStatus,
    });
  }

  async updateOrderStatus(
    id: string,
    createOrderDto: createOrderDto,
  ): Promise<Order> {
    const { status } = createOrderDto;
    const order = await this.getOrderById(id);
    order.status = status;
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    const result = await this.ordersRepository.delete(id);

    if (result.affected === 0) {
      this.logger.error(`Could not delete item with ID: ${id}`);
    }
  }

  async getTotalSales(): Promise<number> {
    const orderTotals = await this.ordersRepository.find({
      select: ['totalPrice'],
    });
    return orderTotals.reduce((a, b) => a + b.totalPrice, 0);
  }
}
