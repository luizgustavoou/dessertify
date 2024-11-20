import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SigninParamsDto } from '@/presentation/dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @Inject('PAYMENTS_SERVICE') private readonly paymentsService: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async getHello(): Promise<void> {
    await this.paymentsService.emit('user_created', {
      name: 'John',
      email: 'john@example.com',
    });
  }

  async signin(params: SigninParamsDto) {
    const token = await this.jwtService.signAsync({
      id: 'ssadsadassda',
      email: 'johndoe@gmail.com',
    });

    return {
      token,
    };
  }
}
