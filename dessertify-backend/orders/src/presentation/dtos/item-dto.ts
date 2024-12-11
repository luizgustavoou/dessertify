import { IsNumber, IsUUID } from 'class-validator';

export class ItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
}
