import { FindManyProductsUseCase } from '@/application/usecases/find-many-products.usecase';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindManyProductsQueryDto } from '@/presentation/dtos/find-many-products.dto';
import { CreateProductUseCase } from '@/application/usecases/create-product.usecase';
import { CreateProductDto } from '@/presentation/dtos/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly findManyProductsUseCase: FindManyProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Get('')
  async findManyProducts(
    @Query() findManyOrdersQueryDto: FindManyProductsQueryDto,
  ) {
    return this.findManyProductsUseCase.execute(findManyOrdersQueryDto);
  }

  @Post('')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.createProductUseCase.execute(createProductDto);
  }
}
