import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import { SigninParamsDto } from '@/presentation/dtos/signin.dto';
import { SignupParamsDto } from '@/presentation/dtos/signup.dto';
import {
  CustomerEntity,
  IRawCustomer,
} from '@/domain/entities/customer.entity';
import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';

export interface IRegisterCustomerParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ICheckCredentialsParams {
  email: string;
  password: string;
}
export abstract class AuthService {
  abstract registerCustomer(
    params: IRegisterCustomerParams,
  ): Promise<IRawCustomer>;

  abstract checkCredentials(
    params: ICheckCredentialsParams,
  ): Promise<IRawCustomer>;
}

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async registerCustomer(
    params: IRegisterCustomerParams,
  ): Promise<IRawCustomer> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (customer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const hashPassword = await this.hashProvider.hash({
      content: params.password,
    });

    const newCustomer = CustomerEntity.create({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: hashPassword,
    });

    const customerSaved = await this.authRepository.createCustomer(newCustomer);

    return customerSaved.raw();
  }

  async checkCredentials(
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
