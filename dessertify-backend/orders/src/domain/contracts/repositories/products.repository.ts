import { ProductEntity } from '@/domain/entities/product.entity';

export abstract class ProductsRepository {
  abstract findManyProducts(
    params: TFindManyProductsParams,
  ): Promise<ProductEntity[]>;
  abstract saveProduct(product: ProductEntity): Promise<ProductEntity>;
  abstract findOneById(
    params: TFindOneProductByIdParams,
  ): Promise<ProductEntity | null>;
}

// findOneById
export type TFindOneProductByIdParams = {
  id: string;
};

// findMany
export type TFindManyProductsParams = {
  skip?: number;
  take?: number;
};
