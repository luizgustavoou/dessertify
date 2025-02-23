import { Type } from 'class-transformer';
import { DeliveryAddressDto } from '@/presentation/dtos/delivery-address.dto';
import {
  ArrayMinSize,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ItemDto {
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
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress?: DeliveryAddressDto;
}
