import { ProductEntity } from '@/domain/entities/product.entity';

export class OrderItemEntity {
  public id: string;
  public orderId: string;
  public product: ProductEntity;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(params: Partial<OrderItemEntity>) {
    Object.assign(this, params);
  }
}
