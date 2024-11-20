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
import { ITokenPayload } from '@/domain/interfaces/token-payload';
@Injectable()
export class AuthService {
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

  async signup(params: SignupParamsDto) {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (customer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const newCustomer = await this.authRepository.createCustomer(params);

    return newCustomer;
  }

  async signin(params: SigninParamsDto) {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.password != params.password) {
      throw new UnauthorizedException('Invalid password');
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
