import { IRawOrder } from '@/domain/entities/order.entity';
import { OrderService } from '@/domain/services';
import { FindManyOrdersQueryDto } from '@/presentation/dtos';
import { Injectable } from '@nestjs/common';

export abstract class FindManyOrdersUseCase {
  abstract execute(params: FindManyOrdersQueryDto): Promise<IRawOrder[]>;
}

@Injectable()
export class FindManyOrdersUseCaseImpl implements FindManyOrdersUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(params: FindManyOrdersQueryDto): Promise<IRawOrder[]> {
    const order = await this.orderService.findManyOrders(params);

    return order;
  }
}
