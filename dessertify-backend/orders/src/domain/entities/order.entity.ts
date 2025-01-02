import { Entity } from '@/domain/entities/entity';
import { OrderItemEntity } from '@/domain/entities/order-item.entity';
import { UnprocessableEntityException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface IBaseOrderItemProps {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const OrderStatus = {
  WAITING_PAYMENT: 'WAITING_PAYMENT',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface IOrderProps {
  customerId: string;
  items: Optional<IBaseOrderItemProps, 'id'>[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRawOrder {
  id: string;
  customerId: string;
  items: IBaseOrderItemProps[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export class OrderEntity extends Entity {
  private _items: IBaseOrderItemProps[];
  private _customerId: string;
  private _status: OrderStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IOrderProps, id: string) {
    if (props.items.length === 0) {
      // TODO: Create a custom error class
      throw new UnprocessableEntityException(
        'Order must have at least one item',
      );
    }
    super(id);

    this.items = props.items;
    this.customerId = props.customerId;
    this._status = OrderStatus.WAITING_PAYMENT;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(
    props: Optional<IOrderProps, 'createdAt' | 'updatedAt'>,
  ): OrderEntity {
    const id = uuidv4();

    const createdAt = props.createdAt || new Date();
    const updatedAt = props.updatedAt || new Date();

    const instance = new OrderEntity({ ...props, createdAt, updatedAt }, id);

    return instance;
  }

  public raw(): IRawOrder {
    return {
      id: this.id,
      customerId: this.customerId,
      items: this.items,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      total: this.total,
      status: this.status,
    };
  }

  public paid(): void {
    if (this.status != OrderStatus.WAITING_PAYMENT) {
      throw new UnprocessableEntityException('Order is already paid');
    }

    this._status = OrderStatus.PENDING;
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): IBaseOrderItemProps[] {
    return this._items;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get total(): number {
    return this.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );
  }

  set items(items: Optional<IBaseOrderItemProps, 'id'>[]) {
    this._items = [];

    this._items = items.map((item) => {
      const itemm = new OrderItemEntity(
        { ...item, orderId: this.id },
        item.id ?? uuidv4(),
      );

      return itemm.raw();
    });
  }

  set customerId(customerId: string) {
    this._customerId = customerId;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }
}
