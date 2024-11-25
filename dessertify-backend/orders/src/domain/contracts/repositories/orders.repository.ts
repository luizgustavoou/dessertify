import { OrderEntity } from '@/domain/entities/order.entity';

export abstract class OrdersRepository {
  abstract findManyOrders(
    params: TFindManyOrdersParams,
  ): Promise<OrderEntity[]>;
  abstract createOrder(params: TCreateOrderParams): Promise<OrderEntity>;
  abstract updateOrder(params: TUpdateOrderParams): Promise<OrderEntity | null>;
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

// create
export type TCreateOrderParams = {
  customerId: string;
  items: {
    productId: string;
    price: number;
    quantity: number;
  }[];
};

// update
export type TUpdateOrderParams = {
  customerId: string;
  items: {
    productId: string;
    price: number;
  }[];
};

// delete
export type TDeleteOrderParams = {
  orderId: string;
};
