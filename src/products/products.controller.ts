import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public, ResponseMessage, UserDecor } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage('Create product successfully')
  create(@Body() createProductDto: CreateProductDto, @UserDecor() user: IUser) {
    return this.productsService.create(createProductDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get all products successfully with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.productsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string, @Query() qs: string) {
    return this.productsService.findOne(id, qs);
  }

  @Patch(':id')
  @ResponseMessage('Update product successfully')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UserDecor() user: IUser,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecor() user: IUser) {
    return this.productsService.remove(id, user);
  }
}
