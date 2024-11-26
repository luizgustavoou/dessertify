import { UnmarshalledOrder } from '@/domain/entities/order.entity';
import { OrderService } from '@/domain/services/orders.service';
import { OrderStatus } from '@/presentation/enums';
import { Injectable } from '@nestjs/common';

export abstract class UpdateOrderUseCase {
  abstract execute(
    id: string,
    params: TUpdateOrderUseCaseParams,
  ): Promise<UnmarshalledOrder>;
}

export type TUpdateOrderUseCaseParams = {
  customerId?: string;
  status?: OrderStatus;
  items?: {
    productId: string;
    quantity: number;
  }[];
};

@Injectable()
export class UpdateOrderUseCaseImpl implements UpdateOrderUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(
    id: string,
    params: TUpdateOrderUseCaseParams,
  ): Promise<UnmarshalledOrder> {
    const order = await this.orderService.updateOrder(id, params);

    return order;
  }
}
