import { Category } from '../categories/category.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from '../cart/cart-item.entity';
import { OrderItem } from '../orders/order-item.entity';

@Entity()
export class Product { 
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    imageUrl: string;

    @Column()
    slug: string;

    @ManyToOne((_type) => Category)
    category: Category;

    @OneToOne((_type) => CartItem)
    cartItem: CartItem;

    @OneToMany((_type) => OrderItem, orderItem => orderItem.product)
    orderItem: OrderItem;

 }