import { PrismaService } from '@/infra/database/prisma.service';

import {
  ProductsRepository,
  TDeleteProductParams,
  TFindManyProductsParams,
  TFindOneProductByIdParams,
} from '@/domain/contracts/repositories/products.repository';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductFactory } from '@/infra/factories/product.factory';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneById(
    params: TFindOneProductByIdParams,
  ): Promise<ProductEntity | null> {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: params.id,
      },
    });

    return product && ProductEntity.create(product);
  }

  findManyProducts(params: TFindManyProductsParams): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.');
  }

  async saveProduct(params: ProductEntity): Promise<ProductEntity> {
    const product = await this.prismaService.product.upsert({
      where: {
        id: params.id,
      },
      update: {
        name: params.name,
        price: params.price,
      },
      create: {
        name: params.name,
        price: params.price,
      },
    });

    return ProductFactory.toDomain(product);
  }

  deleteProduct(params: TDeleteProductParams): Promise<ProductEntity | null> {
    throw new Error('Method not implemented.');
  }
}
