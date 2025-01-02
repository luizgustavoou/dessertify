import { Entity } from '@/domain/entities/entity';
import { UnprocessableEntityException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface IOrderItemProps {
  orderId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface RawOrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  };
  quantity: number;
  orderId: string;
}

export class OrderItemEntity extends Entity {
  private _quantity: number;
  private _product: {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  };
  private _orderId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IOrderItemProps, id: string) {
    if (props.quantity <= 0) {
      throw new UnprocessableEntityException(
        'Item quantity must be greater than 0',
      );
    }

    super(id);
    this.quantity = props.quantity;
    this.product = props.product;
    this.orderId = props.orderId;
  }

  public static create(props: IOrderItemProps): OrderItemEntity {
    const id = uuidv4();

    const instance = new OrderItemEntity(props, id);

    return instance;
  }

  public raw(): RawOrderItem {
    return {
      id: this.id,
      orderId: this.orderId,
      product: this.product,
      quantity: this.quantity,
    };
  }

  get id(): string {
    return this._id;
  }

  set product(product: {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._product = product;
  }

  set orderId(value: string) {
    this._orderId = value;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get product(): {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return this._product;
  }

  get orderId(): string {
    return this._orderId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
