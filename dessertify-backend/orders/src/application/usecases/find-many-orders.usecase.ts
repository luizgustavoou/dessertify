import { OrdersRepository } from '@/domain/contracts/repositories/orders.repository';
import { IRawOrder } from '@/domain/entities/order.entity';
import { FindManyOrdersQueryDto } from '@/presentation/dtos';
import { Injectable } from '@nestjs/common';

export abstract class FindManyOrdersUseCase {
  abstract execute(params: FindManyOrdersQueryDto): Promise<IRawOrder[]>;
}

@Injectable()
export class FindManyOrdersUseCaseImpl implements FindManyOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute(params: FindManyOrdersQueryDto): Promise<IRawOrder[]> {
    const orders = await this.ordersRepository.findManyOrders(params);

    return orders.map((order) => order.raw());
  }
}
