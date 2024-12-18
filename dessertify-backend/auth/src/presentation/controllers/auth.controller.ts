import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SigninParamsDto } from '@/presentation/dtos/signin.dto';
import { SignupParamsDto } from '@/presentation/dtos/signup.dto';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { ITokenPayload } from '@/domain/interfaces/token-payload';
import { SigninUseCase } from '@/application/usecases/signin.usecase';
import { SignupUseCase } from '@/application/usecases/signup.usecase';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AuthGuard, GoogleAuthGuard } from '@/core/guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly signinUseCase: SigninUseCase,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  // @RabbitRPC({
  //   routingKey: 'rpc-2',
  //   exchange: 'exchange2',
  //   queue: 'rpc-2',
  // })
  // rpc(message: object) {
  //   return {
  //     echo: message,
  //   };
  // }

  // @Get('teste2')
  // async teste2() {
  //   return this.amqpConnection.request({
  //     exchange: 'exchange2',
  //     routingKey: 'rpc-2',
  //   });
  //   return await this.signupUseCase.teste();
  // }

  @Get('teste')
  async teste() {
    return await this.signupUseCase.teste();
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

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin(@Request() req) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallback(@Request() req) {
    // TODO: Gerar Token e redirecionar para a aplicação frontend
    // res.redirect(`http://localhost:4200?token=${response.accessToken}`);
    return req.user;
  }
}
