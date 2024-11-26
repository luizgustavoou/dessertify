import { ProductEntity } from '@/domain/entities/product.entity';

export abstract class ProductsRepository {
  abstract findManyProducts(
    params: TFindManyProductsParams,
  ): Promise<ProductEntity[]>;
  abstract saveProduct(params: ProductEntity): Promise<ProductEntity>;
  abstract deleteProduct(
    params: TDeleteProductParams,
  ): Promise<ProductEntity | null>;
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
  filter: {
    customerId?: string;
    skip?: number;
    take?: number;
  };
};

// save
export type TSaveProductParams = {
  id?: string;
  name: string;
  price: number;
};

// update
export type TUpdateProductParams = {
  name: string;
  price: number;
};

// delete
export type TDeleteProductParams = {
  id: string;
};
