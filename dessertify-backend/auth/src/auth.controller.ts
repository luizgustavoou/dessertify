import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello() {
    return this.authService.getHello();
  }
}