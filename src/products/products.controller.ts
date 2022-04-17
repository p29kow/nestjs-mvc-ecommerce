import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Render,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { saveImage } from '../../helpers/image-helper';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { RolesGuard } from '../auth/roles.guard';
import { Request, Response } from 'express';
import { CategoriesService } from '../categories/categories.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Res } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService, private categoriesService: CategoriesService) {}

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/create-product')
  @Render('admin/create-product')
  async getCreateProductPage(@Req() req) {    
    const categories = await this.categoriesService.getCategories();
    return {
      title: 'Create Product',
      categories,
      noImageToast: req.flash('noImage')
    };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/edit-product/:id')
  @Render('admin/edit-product')
  async getEditProductPage(@Req() req, @Param() id: string) {
    const product = await this.productsService.getProductById(id);
    const categories = await this.categoriesService.getCategories();
    return {
      product,
      categories,
      title: 'Edit Product',
      noImageToast: req.flash('noImage')

    };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image', saveImage))
  createProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const imagePath = `${basePath}${fileName}`;
    if (!fileName) {
      req.flash('noImage', 'Please add an image');
      res.redirect('/products/create-product');
    }
    return this.productsService.createProduct(createProductDto, imagePath);
  }

  @Get('/:slug')
  @Render('single-product')
  async getProductBySlug(@Param() slug: string) {
    const product = await this.productsService.getProductBySlug(slug);
    return {
      product
    }
  }

  @Get('/:id')
  getProductById(@Param() id: string): Promise<Product> {
    return this.productsService.getProductById(id);
  } 

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image', saveImage))
  updateProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Param() id: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const imagePath = `${basePath}${fileName}`;
    if (!fileName) {
      req.flash('noImage', 'Please add an image');
      res.redirect('/products/edit-product/:id');
    }
    return this.productsService.updateProduct(id, createProductDto, imagePath);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  deleteProduct(@Param() id: string): Promise<void> {
    return this.productsService.deleteProduct(id);
  }
}
