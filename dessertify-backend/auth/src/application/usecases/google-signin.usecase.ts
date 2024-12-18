import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import {
  CustomerEntity,
  RegisterType,
} from '@/domain/entities/customer.entity';
import { ITokenPayload } from '@/application/interfaces/token-payload';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export abstract class GoogleSigninUseCase {
  abstract execute(
    params: TGoogleSigninUseCaseParams,
  ): Promise<TGoogleSigninUseCaseResponse>;
}

export type TGoogleSigninUseCaseParams = {
  email: string;
  firstName: string;
  lastName: string;
};

export type TGoogleSigninUseCaseResponse = {
  access_token: string;
};

@Injectable()
export class GoogleSigninUseCaseImpl implements GoogleSigninUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(
    params: TGoogleSigninUseCaseParams,
  ): Promise<TGoogleSigninUseCaseResponse> {
    let customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (!customer) {
      customer = CustomerEntity.create({
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        password: '',
        registerType: RegisterType.GOOGLE,
      });

      await this.authRepository.createCustomer(customer);
    }

    const payload: ITokenPayload = {
      sub: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }
}
