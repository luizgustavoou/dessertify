import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';
import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import { IRawCustomer } from '@/domain/entities/customer.entity';
import { ITokenPayload } from '@/application/interfaces/token-payload';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export abstract class DefaultSigninUseCase {
  abstract execute(
    params: TDefaultSigninUseCaseParams,
  ): Promise<TDefaultSigninUseCaseResponse>;
}

export type TDefaultSigninUseCaseParams = {
  email: string;
  password: string;
};

export type TDefaultSigninUseCaseResponse = {
  access_token: string;
};

export interface ICheckCredentialsParams {
  email: string;
  password: string;
}

@Injectable()
export class DefaultSigninUseCaseImpl implements DefaultSigninUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(
    params: TDefaultSigninUseCaseParams,
  ): Promise<TDefaultSigninUseCaseResponse> {
    const customer = await this.checkCredentials(params);

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

  private async checkCredentials(
    params: ICheckCredentialsParams,
  ): Promise<IRawCustomer> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const isMatch = await customer.isPasswordValid(params.password, this.hashProvider)

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return customer.raw();
  }
}
