import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeliveryAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  number: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  complement: string;

  @IsString()
  reference: string;
}
