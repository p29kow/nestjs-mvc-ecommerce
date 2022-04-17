import { InternalServerErrorException, Logger } from '@nestjs/common';
import { OrderItem } from './order-item.entity';
import { EntityRepository, getManager, Repository } from 'typeorm';
import { createOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrderStatus } from './order-status.enum';
import { CartItem } from '../cart/cart-item.entity';
import { User } from '../users/user.entity';
import { Cart } from '../cart/cart.entity';
import { InternalServerError } from 'helpers/custom-errors';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  private logger = new Logger(OrdersRepository.name);

  async createOrder(
    authUser,
    createOrderDto: createOrderDto,
  ): Promise<void> {
    const manager = getManager();
    const userId = authUser.id;

    const user = await manager.findOne(User, userId);
    const userCart = await manager.findOne(Cart, { user });
    const cartItems = userCart.cartItems;

    const subTotal = cartItems.map((item) => {
      return item.product.price * item.quantity;
    });

    const { address, contact } = createOrderDto;
    try {
      const order = await this.create({
        user,
        address,
        contact,
        status: OrderStatus.PENDING,
      });
      const savedOrder = await this.save(order);

      const orderItems = cartItems.map((cartItem) => {
        const orderItem = new OrderItem();
        orderItem.product = cartItem.product;
        orderItem.quantity = cartItem.quantity;
        orderItem.order = savedOrder;
        return orderItem;
      });

      await manager.save(OrderItem, orderItems);
      await manager.delete(CartItem, cartItems);

      const totalPrice = subTotal.reduce((a, b) => a + b, 0);

      this.update(savedOrder.id, { totalPrice });

      this.logger.log('Order saved');
    } catch (error) {
      this.logger.error('Failed to add order', error);
      throw new InternalServerError('There is a problem with the server');    }
  }
}
