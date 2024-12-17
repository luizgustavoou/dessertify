import { IsUUID } from 'class-validator';

export class PaidOrderDto {
  @IsUUID()
  orderId: string;
}
