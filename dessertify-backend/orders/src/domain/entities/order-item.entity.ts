import { IProductProps, ProductEntity } from '@/domain/entities/product.entity';
import { Entity } from '@/domain/entities/entity';

export interface IBaseOrderItemProps {
  productId: string;
  quantity: number;
}

export interface IOrderItemProps extends IBaseOrderItemProps {
  orderId: string;
}

export class OrderItemEntity extends Entity<IOrderItemProps> {
  private _product: ProductEntity;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IOrderItemProps, id?: string) {
    super(props, id);
  }

  public static create(props: IOrderItemProps, id?: string): OrderItemEntity {
    const instance = new OrderItemEntity(props, id);

    return instance;
  }

  get id(): string {
    return this._id;
  }

  set product(product: IProductProps | ProductEntity) {
    this._product =
      product instanceof ProductEntity
        ? product
        : ProductEntity.create(product);
  }

  get product(): ProductEntity {
    return this._product;
  }

  get orderId(): string {
    return this.orderId;
  }

  get quantity(): number {
    return this.quantity;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
