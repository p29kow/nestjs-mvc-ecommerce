import { IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
    @IsNumber()
    quantity: number;

    @IsString()
    productId: string;

    @IsString()
    orderId: string;
}