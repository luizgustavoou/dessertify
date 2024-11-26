import { OrderEntity } from '@/domain/entities/order.entity';

export abstract class OrdersRepository {
  abstract findManyOrders(
    params: TFindManyOrdersParams,
  ): Promise<OrderEntity[]>;
  abstract saveOrder(params: OrderEntity): Promise<OrderEntity>;
  abstract deleteOrder(params: TDeleteOrderParams): Promise<OrderEntity | null>;
}

// findMany
export type TFindManyOrdersParams = {
  filter: {
    customerId?: string;
    skip?: number;
    take?: number;
  };
};

// delete
export type TDeleteOrderParams = {
  orderId: string;
};
