import { Entity } from '@/domain/entities/entity';
import {
  IBaseOrderItemProps,
  OrderItemEntity,
  RawBaseOrderItem,
} from '@/domain/entities/order-item.entity';
import { UnprocessableEntityException } from '@nestjs/common';

export const OrderStatus = {
  WAITING_PAYMENT: 'WAITING_PAYMENT',
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

export interface IRawOrder {
  id: string;
  customerId: string;
  items: RawBaseOrderItem[];
  total: number;
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
    instance.status = OrderStatus.WAITING_PAYMENT;

    return instance;
  }

  public raw(): IRawOrder {
    return {
      id: this.id,
      customerId: this.customerId,
      items: this.items.map((item) => item.raw()),
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

    this.status = OrderStatus.PENDING;
  }

  set items(items: IBaseOrderItemProps[]) {
    this._items = [];

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

  get total(): number {
    return this.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );
  }

  set status(status: OrderStatus) {
    this.props.status = status;
  }

  set customerId(customerId: string) {
    this.props.customerId = customerId;
  }
}
