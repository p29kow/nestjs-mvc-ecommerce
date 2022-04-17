import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../products/product.entity';
import { getManager } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { CartItemDto } from './dto/cart-item.dto';
import { ConflictError, InternalServerError, UnauthorisedError } from 'helpers/custom-errors';

@Injectable()
export class CartService {
    private logger = new Logger(CartService.name);

    async getUserCart(user): Promise<Cart> {
        const manager = getManager();
        const userCart = await manager.findOne(Cart, user.cart.id);
        
        return userCart;
    }

    async addToCart(user, cartItemDto: CartItemDto): Promise<void> {
        const { productId, quantity } = cartItemDto;
        const manager = getManager();
        const productInCart = await manager.find(CartItem, { relations: ['product'], where: { product: { id: productId }}})

        if(!user) {
            throw new UnauthorisedError('User is not logged in');
        }

        const product = await manager.findOne(Product, productId);
        const userCart = await this.getUserCart(user);
        
        if(productInCart.length > 0) {
            this.logger.error('Failed to add item to cart');
            throw new ConflictError('The item already exists in cart');
        } 
        try {
            const cartItem = new CartItem();
            cartItem.quantity = quantity;
            cartItem.cart = userCart;
            cartItem.product = product;

            await manager.save(cartItem);
            this.logger.log('Item added to cart');
        } catch (error) {
            throw new InternalServerError('There is a problem with the server');
        }
    }

    async deleteCartItem(user, cartItemDto: CartItemDto): Promise<void> {
        const { id } = cartItemDto;
        const manager = getManager();
        const result = await manager.delete(CartItem, {
            cart: user.cart,
            id,
        });
        this.logger.log('Cart item deleted');

        if(result.affected === 0) {
            this.logger.error('Cart Item could not be deleted');
        }
    }
}
