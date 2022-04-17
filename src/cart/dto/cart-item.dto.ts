import { IsNumber, IsString } from "class-validator";

export class CartItemDto {
    @IsString()
    id: string;
    
    @IsString()
    cartId: string;

    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;
}