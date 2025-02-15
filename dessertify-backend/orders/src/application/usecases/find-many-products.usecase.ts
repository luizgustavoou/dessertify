import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '@/domain/contracts/repositories/products.repository';
import { IRawProduct } from '@/domain/entities';
import { FindManyProductsQueryDto } from '@/presentation/dtos/find-many-products.dto';

export abstract class FindManyProductsUseCase {
  abstract execute(params: FindManyProductsQueryDto): Promise<IRawProduct[]>;
}

@Injectable()
export class FindManyProductsUseCaseImpl implements FindManyProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(params: FindManyProductsQueryDto): Promise<IRawProduct[]> {
    const products = await this.productsRepository.findManyProducts({
      skip: params.skip,
      take: params.take,
    });

    return products.map((product) => product.raw());
  }
}
