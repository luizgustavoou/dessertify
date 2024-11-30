import { RawOrder } from '@/domain/entities/order.entity';
import { OrderService } from '@/domain/services/orders.service';
import { FindManyOrdersQueryDto } from '@/presentation/dtos/find-many-orders.dto';
import { Injectable } from '@nestjs/common';

export abstract class FindManyOrdersUseCase {
  abstract execute(params: FindManyOrdersQueryDto): Promise<RawOrder[]>;
}

@Injectable()
export class FindManyOrdersUseCaseImpl implements FindManyOrdersUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(params: FindManyOrdersQueryDto): Promise<RawOrder[]> {
    const order = await this.orderService.findManyOrders(params);

    return order;
  }
}
