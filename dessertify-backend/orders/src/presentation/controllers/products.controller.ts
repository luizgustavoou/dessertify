import { FindManyProductsUseCase } from '@/application/usecases/find-many-products.usecase';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FindManyProductsQueryDto } from '@/presentation/dtos/find-many-products.dto';
import { CreateProductUseCase } from '@/application/usecases/create-product.usecase';
import { CreateProductDto } from '@/presentation/dtos/create-product.dto';
import { UpdateProductDto } from '@/presentation/dtos/update-product.dto';
import { UpdateProductUseCase } from '@/application/usecases/update-product.usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly findManyProductsUseCase: FindManyProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
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

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.updateProductUseCase.execute(updateProductDto, id);
  }
}
