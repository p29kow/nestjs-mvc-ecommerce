import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { OrderItem } from "../order-item.entity";
import { OrderStatus } from "../order-status.enum";
import { PaymentStatus } from "../payment-status.enum";

export class createOrderDto {
    
    @IsString()
    orderItemId: string;

    @IsString()
    userId: string;

    @IsString()
    address: string;

    @IsString()
    contact: string;

    @IsNumber()
    totalPrice: number;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

}