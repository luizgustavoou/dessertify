import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';
import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import { IRawCustomer } from '@/domain/entities/customer.entity';
import { ITokenPayload } from '@/domain/interfaces/token-payload';
import { AuthService } from '@/domain/services/auth.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export abstract class SigninUseCase {
  abstract execute(
    params: TSigninUseCaseParams,
  ): Promise<TSigninUseCaseResponse>;
}

export type TSigninUseCaseParams = {
  email: string;
  password: string;
};

export type TSigninUseCaseResponse = {
  access_token: string;
};

export interface ICheckCredentialsParams {
  email: string;
  password: string;
}

@Injectable()
export class SigninUseCaseImpl implements SigninUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(params: TSigninUseCaseParams): Promise<TSigninUseCaseResponse> {
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

    if (!customer.isPasswordValid(params.password, this.hashProvider)) {
      throw new UnauthorizedException('Invalid password');
    }

    return customer.raw();
  }
}
