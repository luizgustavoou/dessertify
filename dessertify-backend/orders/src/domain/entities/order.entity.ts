import { Entity } from '@/domain/entities/entity';
import { UnprocessableEntityException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IRawOrderItem } from './order-item.entity';
import {
  DeliveryAddress,
  IDeliveryAddressProps,
} from '@/domain/entities/delivery-address.value-object';

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
  items: Optional<Omit<IRawOrderItem, 'orderId'>, 'id'>[];
  deliveryAddress: IDeliveryAddressProps;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRawOrder {
  id: string;
  customerId: string;
  items: Omit<IRawOrderItem, 'orderId'>[];
  total: number;
  status: OrderStatus;
  paid: boolean;
  deliveryAddress: IDeliveryAddressProps;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderEntity extends Entity {
  private _paid: boolean;
  private _items: Omit<IRawOrderItem, 'orderId'>[];
  private _customerId: string;
  private _status: OrderStatus;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deliveryAddress: DeliveryAddress;

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
    this._paid = props.paid;
    this._deliveryAddress = new DeliveryAddress(props.deliveryAddress);
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      total: this.total,
      status: this.status,
      paid: this.paid,
      deliveryAddress: this.deliveryAddress.raw(),
    };
  }

  public pay(): void {
    if (this.paid) {
      throw new UnprocessableEntityException('Order is already paid');
    }

    this._status = OrderStatus.PENDING;
    this._paid = true;
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): Omit<IRawOrderItem, 'orderId'>[] {
    return this._items;
  }

  get paid(): boolean {
    return this._paid;
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

  get deliveryAddress(): DeliveryAddress {
    return this._deliveryAddress;
  }

  set items(items: Optional<Omit<IRawOrderItem, 'orderId'>, 'id'>[]) {
    this._items = [];

    this._items = items.map((item) => ({
      id: item.id || uuidv4(),
      quantity: item.quantity,
      product: item.product,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
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

  set deliveryAddress(deliveryAddress: DeliveryAddress) {
    this._deliveryAddress = deliveryAddress;
  }
}
