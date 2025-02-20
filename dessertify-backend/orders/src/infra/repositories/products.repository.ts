import { PrismaService } from '@/infra/database/prisma.service';

import {
  ProductsRepository,
  TFindManyProductsParams,
  TFindOneProductByIdParams,
} from '@/domain/contracts/repositories/products.repository';
import { ProductEntity } from '@/domain/entities/product.entity';
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

    return product && new ProductEntity(product, product.id);
  }

  async findManyProducts(
    params: TFindManyProductsParams,
  ): Promise<ProductEntity[]> {
    const products = await this.prismaService.product.findMany({
      skip: params.skip,
      take: params.take,
    });

    return products.map((product) => new ProductEntity(product, product.id));
  }

  async saveProduct(product: ProductEntity): Promise<ProductEntity> {
    const productUpserted = await this.prismaService.product.upsert({
      where: {
        id: product.id,
      },
      update: {
        name: product.name,
        price: product.price,
      },
      create: {
        name: product.name,
        price: product.price,
      },
    });

    return new ProductEntity(productUpserted, productUpserted.id);
  }
}
