import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';
import { IndexReturnInterface } from './index-return.interface';
import { HomeGuard } from './main.guard';

@Controller('/')
export class MainController {
  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService,
  ) {}

  @UseGuards(HomeGuard)
  @Get()
  @Render('index')
  async getIndexPage(@Req() req) {
    const products = await this.productsService.getProducts();
    const categories = await this.categoriesService.getCategories();
    const returnedResults: IndexReturnInterface = {
      title: 'Welcome',
      products,
      categories,
      user: req.user,
      error: req.flash('cartError'),
      success: req.flash('cartSuccess'),
      order: req.flash('orderSuccess'),
      serverError: req.flash('serverError'),
      signoutMessage: req.flash('signout'),
      deletedItem: req.flash('deletedItem'),
    };
    if (req.user) {
      const cart = await this.cartService.getUserCart(req.user);
      returnedResults.cart = cart;
    }
    return returnedResults;
  }
}
