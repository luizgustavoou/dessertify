import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { SigninParamsDto } from '@/dtos/signin.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log('ola caralho');
  }

  @Get()
  getHello() {
    // return this.authService.getHello();
    return 'hello world!';
  }

  @Post('signin')
  async signin(@Body() body: SigninParamsDto) {
    return this.authService.signin(body);
  }
}
