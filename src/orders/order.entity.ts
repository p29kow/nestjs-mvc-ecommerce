import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { OrderStatus } from "./order-status.enum";
import { OrderItem } from "../orders/order-item.entity";
import { PaymentStatus } from "./payment-status.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    address: string;

    @Column()
    contact: string;

    @Column()
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: 0 })
    totalPrice: number; 

    @Column({ default: PaymentStatus.UNPAID })
    paymentStatus: PaymentStatus;
    
    @OneToMany((_type) => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];

    @ManyToOne((_type) => User, user => user.orders, {
        eager: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    user: User;
}