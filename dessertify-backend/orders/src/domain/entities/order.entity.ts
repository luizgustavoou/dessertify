import { Entity } from '@/domain/entities/entity';
import { IBaseOrderItemProps } from '@/domain/entities/order-item.entity';

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface IOrderProps {
  customerId: string;
  items: IBaseOrderItemProps[];
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawOrder {
  id: string;
  customerId: string;
  items: IBaseOrderItemProps[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export class OrderEntity extends Entity<IOrderProps> {
  private _items: IBaseOrderItemProps[];

  private constructor(props: IOrderProps, id?: string) {
    super(props, id);

    if (props.items.length === 0) {
      // TODO: Create a custom error class
      throw new Error('Order must have at least one item');
    }
  }

  public static create(props: IOrderProps, id?: string): OrderEntity {
    const instance = new OrderEntity(props, id);

    instance.items = props.items;
    return instance;
  }

  public raw(): RawOrder {
    return {
      id: this.id,
      customerId: this.customerId,
      items: this.items,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      status: this.status,
    };
  }

  set items(items: IBaseOrderItemProps[]) {
    this._items = [];
    this._items = items;
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get items(): IBaseOrderItemProps[] {
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
