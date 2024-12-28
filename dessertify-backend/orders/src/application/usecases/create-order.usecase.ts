import { IRawOrder } from '@/domain/entities/order.entity';
import { CreateChargeEvent } from '@/domain/events/create-charge.event';
import { OrderService } from '@/domain/services';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CardDetails } from '@/domain/events/create-charge.event';

export abstract class CreateOrderUseCase {
  abstract execute(params: TCreateOrderUseCaseParams): Promise<IRawOrder>;
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
  constructor(
    private readonly orderService: OrderService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async execute(
    params: TCreateOrderUseCaseParams,
  ): Promise<IRawOrder & { clientSecret: string }> {
    try {
      const order = await this.orderService.createOrder(params);

      // const cardDetails = new CardDetails('123', '4242424242424242');

      const createChargeEvent = new CreateChargeEvent(
        // cardDetails,
        order.total,
        order.customerId,
        order.id,
      );

      const res = await this.amqpConnection.request<{ client_secret: string }>({
        exchange: 'orders-topic-exchange',
        routingKey: 'orders.created',
        payload: createChargeEvent,
      });

      return { ...order, clientSecret: res.client_secret };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error creating order. Cause: ' + error.message,
      );
    }
  }
}
