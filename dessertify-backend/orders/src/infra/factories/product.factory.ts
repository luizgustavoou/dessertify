import { IProductProps, ProductEntity } from '@/domain/entities/product.entity';

export class ProductFactory {
  static toDomain(product: IProductProps): ProductEntity {
    return ProductEntity.create(product);
  }
}
