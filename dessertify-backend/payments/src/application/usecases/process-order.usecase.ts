import { CustomersRepository } from '@/domain/repositories';
import { StripeService } from '@/infra/payments/stripe/stripe.service';
import { CreateChargeDto } from '@/presentation/dtos';
import { Injectable } from '@nestjs/common';

export interface IProcessOrderUseCaseResponse {
  client_secret: string;
}

export abstract class ProcessOrderUseCase {
  abstract execute(
    params: CreateChargeDto,
  ): Promise<IProcessOrderUseCaseResponse>;
}

@Injectable()
export class ProcessOrderUseCaseImpl implements ProcessOrderUseCase {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly stripeService: StripeService,
  ) {}

  async execute(
    params: CreateChargeDto,
  ): Promise<IProcessOrderUseCaseResponse> {
    const customer = await this.customersRepository.findByAuthCustomerId(
      params.customerId,
    );

    if (!customer) {
      // TODO: Enviar um evento de cliente não encontrado
      throw new Error('Customer not found');
    }

    const charge = await this.stripeService.createPaymentIntent({
      amount: params.amount,
      orderId: params.orderId,
    });

    return {
      client_secret: charge.client_secret,
    };
  }
}
