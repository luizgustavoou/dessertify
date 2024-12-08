import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class SignupParamsDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  // @IsNotEmpty()
  lastName: string;
}
