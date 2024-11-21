import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import { SigninParamsDto } from '@/presentation/dtos/signin.dto';
import { SignupParamsDto } from '@/presentation/dtos/signup.dto';
import { CustomerEntity } from '@/domain/entities/customer.entity';
import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';

export abstract class AuthService {
  abstract signup(params: SignupParamsDto): Promise<CustomerEntity>;

  abstract signin(params: SigninParamsDto): Promise<CustomerEntity>;
}

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async signup(params: SignupParamsDto): Promise<CustomerEntity> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (customer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const hashPassword = await this.hashProvider.hash({
      content: params.password,
    });

    const newCustomer = await this.authRepository.createCustomer({
      ...params,
      password: hashPassword,
    });

    return newCustomer;
  }

  async signin(params: SigninParamsDto): Promise<CustomerEntity> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (!customer.isPasswordValid(params.password, this.hashProvider)) {
      throw new UnauthorizedException('Invalid password');
    }

    return customer;
  }
}
