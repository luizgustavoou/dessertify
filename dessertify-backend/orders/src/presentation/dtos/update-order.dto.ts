import { OrderStatus } from '@/presentation/enums/index';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @ArrayMinSize(1)
  items?: ItemDto[];

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
