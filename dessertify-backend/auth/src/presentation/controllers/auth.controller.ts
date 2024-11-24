import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '@/domain/services/auth.service';
import { SigninParamsDto } from '@/presentation/dtos/signin.dto';
import { AuthGuard } from '@/core/guards/auth.guard';
import { SignupParamsDto } from '@/presentation/dtos/signup.dto';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { ITokenPayload } from '@/domain/interfaces/token-payload';
import { SigninUseCase } from '@/application/usecases/signin.usecase';
import { SignupUseCase } from '@/application/usecases/signup.usecase';
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';

@Controller()
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly signinUseCase: SigninUseCase,
    private readonly amqpConnection: AmqpConnection,
  ) {}


  @RabbitRPC({
    routingKey: 'rpc-2',
    exchange: 'exchange2',
    queue: 'rpc-2',
  })
  rpc(message: object) {
    return {
      echo: message,
    };
  }

  
  @Get('teste')
  async teste() {
    return this.amqpConnection.request({
      exchange: 'exchange2',
      routingKey: 'rpc-2',
    });
    // return await this.signupUseCase.teste();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: ITokenPayload) {
    return user;
  }

  @Post('signup')
  async signup(@Body() body: SignupParamsDto) {
    return await this.signupUseCase.execute(body);
  }

  @Post('signin')
  async signin(@Body() body: SigninParamsDto) {
    return await this.signinUseCase.execute(body);
  }
}
