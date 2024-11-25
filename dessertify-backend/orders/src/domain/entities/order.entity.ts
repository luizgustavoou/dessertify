import { OrderItemEntity } from '@/domain/entities/order-item.entity';

export const orderStatus = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];

export type OrderStatus = (typeof orderStatus)[number];

export class OrderEntity {
  public id: string;
  public customerId: string;
  public items: OrderItemEntity[];
  public createdAt: Date;
  public updatedAt: Date;
  public status: OrderStatus;

  constructor(params: Partial<OrderEntity>) {
    Object.assign(this, params);
  }
}
