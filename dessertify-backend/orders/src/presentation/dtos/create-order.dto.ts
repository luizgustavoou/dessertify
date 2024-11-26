import { OrderStatus } from '@/presentation/enums/index';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsNumber,
  IsUUID,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ItemDto {
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
''