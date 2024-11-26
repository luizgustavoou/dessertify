import { UnmarshalledOrder } from '@/domain/entities/order.entity';
import { OrderService } from '@/domain/services/orders.service';
import { Injectable } from '@nestjs/common';

export abstract class CreateOrderUseCase {
  abstract execute(
    params: TCreateOrderUseCaseParams,
  ): Promise<UnmarshalledOrder>;
}

export type TCreateOrderUseCaseParams = {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

@Injectable()
export class CreateOrderUseCaseImpl implements CreateOrderUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(params: TCreateOrderUseCaseParams): Promise<UnmarshalledOrder> {
    const order = await this.orderService.createOrder(params);

    return order;
  }
}
