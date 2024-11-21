import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '@/domain/repositories/auth.repository';
import { SigninParamsDto } from '@/presentation/dtos/signin.dto';
import { SignupParamsDto } from '@/presentation/dtos/signup.dto';
import { CustomerEntity } from '@/domain/entities/customer.entity';

export abstract class AuthService {
  abstract signup(params: SignupParamsDto): Promise<CustomerEntity>;

  abstract signin(params: SigninParamsDto): Promise<CustomerEntity>;
}

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject('PAYMENTS_SERVICE') private readonly paymentsService: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async getHello(): Promise<void> {
    await this.paymentsService.emit('user_created', {
      name: 'John',
      email: 'john@example.com',
    });
  }

  async signup(params: SignupParamsDto): Promise<CustomerEntity> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (customer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const newCustomer = await this.authRepository.createCustomer(params);

    return newCustomer;
  }

  async signin(params: SigninParamsDto): Promise<CustomerEntity> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (!customer.isPasswordValid(params.password)) {
      throw new UnauthorizedException('Invalid password');
    }

    return customer;
  }
}
