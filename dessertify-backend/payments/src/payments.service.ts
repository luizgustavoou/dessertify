import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  getHello(): string {
    return "I'm auth serviec!";
  }
}