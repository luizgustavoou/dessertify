import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, Observable, of } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    @Inject('PAYMENTS_SERVICE') private readonly paymentsService: ClientProxy,
  ) {}

  async getHello(): Promise<void> {
    await this.paymentsService.emit('user_created', {
      name: 'John',
      email: 'john@example.com',
    });
  }
}