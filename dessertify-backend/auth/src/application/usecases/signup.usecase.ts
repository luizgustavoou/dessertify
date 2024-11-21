import { CustomerEntity } from '@/domain/entities/customer.entity';
import { AuthService } from '@/domain/services/auth.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export abstract class SignupUseCase {
  abstract execute(
    params: TSignupUseCaseParams,
  ): Promise<TSignupUseCaseResponse>;
}

export type TSignupUseCaseParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type TSignupUseCaseResponse = CustomerEntity;

@Injectable()
export class SignupUseCaseImpl implements SignupUseCase {
  constructor(
    private readonly authService: AuthService,
    @Inject('PAYMENTS_SERVICE') private readonly paymentsService: ClientProxy,
  ) {}

  async execute(params: TSignupUseCaseParams): Promise<TSignupUseCaseResponse> {
    const customer = await this.authService.signup(params);

    return customer;
  }
}
