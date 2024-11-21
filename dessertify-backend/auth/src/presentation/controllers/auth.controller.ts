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

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly signinUseCase: SigninUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: ITokenPayload) {
    return user;
  }

  @Post('signup')
  async signup(@Body() body: SignupParamsDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  async signin(@Body() body: SigninParamsDto) {
    return this.signinUseCase.execute(body);
  }
}
