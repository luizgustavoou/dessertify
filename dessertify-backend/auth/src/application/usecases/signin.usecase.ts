import { ITokenPayload } from '@/domain/interfaces/token-payload';
import { AuthService } from '@/domain/services/auth.service';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class SigninUseCaseImpl implements SigninUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async execute(params: TSigninUseCaseParams): Promise<TSigninUseCaseResponse> {
    const customer = await this.authService.signin(params);

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
