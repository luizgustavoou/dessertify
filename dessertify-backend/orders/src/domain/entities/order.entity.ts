import { Entity } from '@/domain/entities/entity';
import {
  IBaseOrderItemProps,
  OrderItemEntity,
  RawBaseOrderItem,
} from '@/domain/entities/order-item.entity';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface IOrderProps {
  id?: string;
  customerId: string;
  items: IBaseOrderItemProps[];
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawOrder {
  id: string;
  customerId: string;
  items: RawBaseOrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export class OrderEntity extends Entity<IOrderProps> {
  private _items: OrderItemEntity[];

  private constructor({ id, ...props }: IOrderProps) {
    super(props, id);

    if (props.items.length === 0) {
      // TODO: Create a custom error class
      throw new UnprocessableEntityException(
        'Order must have at least one item',
      );
    }
  }

  public static create(props: IOrderProps): OrderEntity {
    const instance = new OrderEntity(props);

    instance.items = props.items;
    return instance;
  }

  public raw(): RawOrder {
    return {
      id: this.id,
      customerId: this.customerId,
      items: this.items.map((item) => item.raw()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      status: this.status,
    };
  }

  set items(items: IBaseOrderItemProps[]) {
    this._items = [];

    console.log('items ', items)
    this._items = items.map((item) =>
      OrderItemEntity.create({ ...item, orderId: this.id }),
    );
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get items(): OrderItemEntity[] {
    return this._items;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set status(status: OrderStatus) {
    this.props.status = status;
  }

  set customerId(customerId: string) {
    this.props.customerId = customerId;
  }
}
