import { OrderItemEntity } from '@/domain/entities/order-item.entity';
import { Entity } from '@/domain/entities/entity';

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface IOrderItem {
  id?: string;
  productId: string;
  quantity: number;
}
export interface IOrderProps {
  id?: string;
  customerId: string;
  items: IOrderItem[];
  status: OrderStatus;
}

export interface UnmarshalledOrder {
  id: string;
  customerId: string;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
}

export class OrderEntity extends Entity<IOrderProps> {
  private _items: IOrderItem[];
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor({ id, ...props }: IOrderProps) {
    super(props, id);

    if (props.items.length === 0) {
      // TODO: Create a custom error class
      throw new Error('Order must have at least one item');
    }
  }

  public static create(props: IOrderProps): OrderEntity {
    const instance = new OrderEntity(props);

    instance.items = props.items;
    return instance;
  }

  public unmarshal(): UnmarshalledOrder {
    return {
      id: this.id,
      customerId: this.customerId,
      items: this.items,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      status: this.status,
    };
  }

  set items(items: IOrderItem[]) {
    this._items = [];
    this._items = items;
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get items(): IOrderItem[] {
    return this._items;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set status(status: OrderStatus) {
    this.props.status = status;
  }

  set customerId(customerId: string) {
    this.props.customerId = customerId;
  }
}
