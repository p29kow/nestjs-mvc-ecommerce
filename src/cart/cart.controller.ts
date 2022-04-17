import { Body, Controller, Delete, Get, Post, Render, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CartConflictFilter } from '../common/filters/cart-conflict.filter';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartConflictInterceptor } from '../common/interceptors/cart-conflict.interceptor';
import { Res } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';


@Controller('cart')
export class CartController {
    constructor(private cartService: CartService){}

    @UseGuards(AuthenticatedGuard)
    @Get('checkout')
    @Render('checkout')
    async getCeckoutPage(@Req() req) {  
        const user = req.user;              
        const cart = await this.cartService.getUserCart(user);
        const subTotal = cart.cartItems.map((item) => {
            return item.product.price * item.quantity;
          });
        const totalPrice = subTotal.reduce((a, b) => a + b, 0);
        return {
            title: 'Checkout',
            cart,
            user,
            totalPrice
        }
    }

    @UseInterceptors(CartConflictInterceptor)
    @UseFilters(CartConflictFilter)
    @UseGuards(AuthenticatedGuard)
    @Post()
    async addToCart(@Req() req, @Body() cartItemDto: CartItemDto) {
        return this.cartService.addToCart(req.user, cartItemDto);
    }

    @UseGuards(AuthenticatedGuard)
    @Delete()
    async deleteCartItem(@Req() req, @Res() res, @Body() cartItemDto: CartItemDto) {
        req.flash('deletedItem', 'Item was removed');
        res.redirect('/');
        return this.cartService.deleteCartItem(req.user, cartItemDto);
    }
}
