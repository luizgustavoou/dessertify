import { ProductsRepository } from '@/domain/contracts/repositories/products.repository';
import { IRawProduct, ProductEntity } from '@/domain/entities';
import { CreateProductDto } from '@/presentation/dtos/create-product.dto';
import { Injectable } from '@nestjs/common';

export abstract class CreateProductUseCase {
  abstract execute(params: CreateProductDto): Promise<IRawProduct>;
}

@Injectable()
export class CreateProductUseCaseImpl implements CreateProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(params: CreateProductDto): Promise<IRawProduct> {
    const product = ProductEntity.create({
      name: params.name,
      price: params.price,
    });

    const newProduct = await this.productsRepository.saveProduct(product);

    return newProduct.raw();
  }
}
