import { OrdersRepository } from '@/domain/contracts/repositories/orders.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

export interface MarkOrderAsPaidUseCaseParams {
  orderId: string;
}

export abstract class MarkOrderAsPaidUseCase {
  public abstract execute(params: MarkOrderAsPaidUseCaseParams): Promise<void>;
}

@Injectable()
export class MarkOrderAsPaidUseCaseImpl implements MarkOrderAsPaidUseCase {
  constructor(private readonly orderRepository: OrdersRepository) {}

  public async execute({
    orderId,
  }: MarkOrderAsPaidUseCaseParams): Promise<void> {
    const order = await this.orderRepository.findOneById({ id: orderId });

    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.pay();

    await this.orderRepository.saveOrder(order);
  }
}
