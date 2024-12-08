import { Expose } from 'class-transformer';
import {
  IsEmail,
  isEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCustomerDto {
  @Expose()
  @IsUUID()
  public id: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;
}
