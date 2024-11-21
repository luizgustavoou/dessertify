import { CustomerEntity } from '@/domain/entities/customer.entity';
import { AuthService } from '@/domain/services/auth.service';
import { Injectable } from '@nestjs/common';

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
  constructor(private readonly authService: AuthService) {}

  async execute(params: TSignupUseCaseParams): Promise<TSignupUseCaseResponse> {
    const customer = await this.authService.signup(params);

    return customer;
  }
}
