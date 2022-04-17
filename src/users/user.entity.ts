import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { Order } from '../orders/order.entity';
import { Cart } from '../cart/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column()
  userRole: UserRole;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  contact: string;

  @OneToOne((_type) => Cart, (cart) => cart.user, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @OneToMany((_type) => Order, (order) => order.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  orders: Order[];
}
