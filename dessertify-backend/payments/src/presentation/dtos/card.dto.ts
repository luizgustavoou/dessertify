import { Expose } from 'class-transformer';
import { IsCreditCard, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CardDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  cvc: string;


  @Expose()
  @IsOptional()
  @IsNumber()
  exp_month?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  exp_year?: number;

  @Expose()
  @IsCreditCard()
  number: string;
}
