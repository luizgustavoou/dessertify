import { FindManyProductsUseCase } from '@/application/usecases/find-many-products.usecase';
import { Controller, Get, Query } from '@nestjs/common';
import { FindManyProductsQueryDto } from '@/presentation/dtos/find-many-products.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly findManyProductsUseCase: FindManyProductsUseCase,
  ) {}

  @Get('')
  async findManyProducts(
    @Query() findManyOrdersQueryDto: FindManyProductsQueryDto,
  ) {
    return this.findManyProductsUseCase.execute(findManyOrdersQueryDto);
  }
}
