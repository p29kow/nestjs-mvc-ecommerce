import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { CartItem } from '../cart/cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne((_type) => User, user => user.cart, { nullable: false, onUpdate: 'CASCADE', onDelete:'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany((_type) => CartItem, cartitem => cartitem.cart, {
    eager: true
  })
  cartItems: CartItem[];
}
