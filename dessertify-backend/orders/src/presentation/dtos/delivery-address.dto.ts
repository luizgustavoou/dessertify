import { IsNumber, IsString } from 'class-validator';

export class DeliveryAddressDto {
  @IsString()
  street: string;

  @IsNumber()
  number: number;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  zipcode: string;
}
