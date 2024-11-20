import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { SigninParamsDto } from '@/presentation/dtos/signin.dto';
import { AuthGuard } from '@/core/guards/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  getHello() {
    return this.authService.getHello();
  }

  @Post('signin')
  async signin(@Body() body: SigninParamsDto) {
    return this.authService.signin(body);
  }
}
