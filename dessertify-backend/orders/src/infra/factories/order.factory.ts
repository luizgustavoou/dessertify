import { IOrderProps, OrderEntity } from '@/domain/entities/order.entity';

export class OrderFactory {
  static toDomain(order: IOrderProps, id: string): OrderEntity {
    return OrderEntity.create(order);
  }
}
