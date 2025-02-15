import { ProductsRepository } from '@/domain/contracts/repositories/products.repository';
import { IRawProduct, ProductEntity } from '@/domain/entities';
import { UpdateProductDto } from '@/presentation/dtos/update-product.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

export abstract class UpdateProductUseCase {
  abstract execute(params: UpdateProductDto, id: string): Promise<IRawProduct>;
}

@Injectable()
export class UpdateProductUseCaseImpl implements UpdateProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(params: UpdateProductDto, id: string): Promise<IRawProduct> {
    const product = await this.productsRepository.findOneById({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.update({
      name: params.name,
      price: params.price,
    });

    const updatedProduct = await this.productsRepository.saveProduct(product);

    return updatedProduct.raw();
  }
}
