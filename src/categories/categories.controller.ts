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
import { UserRole } from '../users/user-role.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Request } from 'express';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImage } from 'helpers/image-helper';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @Render('all-categories')
  async getCategories() {
    const categories = await this.categoriesService.getCategories() 
    return {
      title: 'Categories',
      categories
    };    
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('create-category')
  @Render('admin/create-category')
  getCreateCategoryPage() {
    return {
      title: 'Create Category'
    }
  }
  // @Get('/:id')
  // getCategoryById(@Param() id: string) {
  //   return this.categoriesService.getCategoryById(id);
  // }

  // @Get('/:slug')
  // getCategoryBySlug(@Param() slug: string) {
  //   return 
  // }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image', saveImage))
  createcategory(
    @Req() req: Request,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const imagePath = `${basePath}${fileName}`;

    return this.categoriesService.createCategory(createCategoryDto, imagePath);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image', saveImage))
  updateCategory(
    @Req() req: Request,
    @Param() id: string,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const imagePath = `${basePath}${fileName}`;

    return this.categoriesService.updateCategory(
      id,
      createCategoryDto,
      imagePath
    );
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  deleteCategory(@Param() id: string): Promise<void> {
    return this.categoriesService.deleteCategory(id);
  }
}
