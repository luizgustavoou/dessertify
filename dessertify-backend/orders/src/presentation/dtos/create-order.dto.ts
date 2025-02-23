import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { DeliveryAddressDto } from '@/presentation/dtos/delivery-address.dto';



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

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;
}
