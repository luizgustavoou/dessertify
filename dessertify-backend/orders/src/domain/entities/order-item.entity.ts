import {
  IProductProps,
  IRawProduct,
  ProductEntity,
} from '@/domain/entities/product.entity';
import { Entity } from '@/domain/entities/entity';
import { UnprocessableEntityException } from '@nestjs/common';

export interface IBaseOrderItemProps {
  id?: string;
  quantity: number;
  product: ProductEntity | IProductProps;
}

export interface IOrderItemProps extends IBaseOrderItemProps {
  orderId: string;
}

export interface RawBaseOrderItem {
  id: string;
  product: IRawProduct;
  quantity: number;
  orderId: string;
}

export interface RawOrderItem extends RawBaseOrderItem {
  orderId: string;
}

export class OrderItemEntity extends Entity<IOrderItemProps> {
  private _product: ProductEntity;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({ id, ...props }: IOrderItemProps) {
    if (props.quantity <= 0) {
      throw new UnprocessableEntityException(
        'Item quantity must be greater than 0',
      );
    }

    super(props, id);
  }

  public static create(props: IOrderItemProps): OrderItemEntity {
    const instance = new OrderItemEntity(props);

    instance.product = props.product;

    return instance;
  }

  public raw(): RawOrderItem {
    return {
      id: this.id,
      orderId: this.orderId,
      product: this.product.raw(),
      quantity: this.quantity,
    };
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
    return this.props.orderId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
