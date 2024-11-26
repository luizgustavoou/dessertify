import { IProductProps, ProductEntity } from '@/domain/entities/product.entity';
import { Entity } from './entity';

export interface IOrderItemProps {
  id?: string;
  orderId: string;
  productId: string;
  quantity: number;
}

export class OrderItemEntity extends Entity<IOrderItemProps> {
  private _product: ProductEntity;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({ id, ...props }: IOrderItemProps) {
    super(props, id);
  }

  public static create(props: IOrderItemProps): OrderItemEntity {
    const instance = new OrderItemEntity(props);

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
