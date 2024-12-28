import { RegisterType } from '@/domain/entities/customer.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignupParamsDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string | null;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(RegisterType)
  type: RegisterType = RegisterType.DEFAULT;
}
