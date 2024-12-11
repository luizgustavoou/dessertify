import { IRawOrder } from '@/domain/entities';
import { OrderService } from '@/domain/services';
import { OrderStatus } from '@/presentation/enums';
import { Injectable } from '@nestjs/common';

export abstract class UpdateOrderUseCase {
  abstract execute(
    id: string,
    params: TUpdateOrderUseCaseParams,
  ): Promise<IRawOrder>;
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
  ): Promise<IRawOrder> {
    const order = await this.orderService.updateOrder(id, params);

    return order;
  }
}
