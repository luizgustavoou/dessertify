import { OrderEntity } from '@/domain/entities/order.entity';

export abstract class OrdersRepository {
  abstract findManyOrders(
    params: TFindManyOrdersParams,
  ): Promise<OrderEntity[]>;
  abstract saveOrder(params: OrderEntity): Promise<OrderEntity>;
  abstract deleteOrder(params: TDeleteOrderParams): Promise<OrderEntity | null>;
  abstract findOneById(
    params: TFindOneOrderByIdParams,
  ): Promise<OrderEntity | null>;
}

// findOneById
export type TFindOneOrderByIdParams = {
  id: string;
};

// findMany
export type TFindManyOrdersParams = {
  customerId?: string;
  skip?: number;
  take?: number;
};

// delete
export type TDeleteOrderParams = {
  orderId: string;
};
