import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @ArrayMinSize(1)
  items: ItemDto[];
}
