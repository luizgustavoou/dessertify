import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class SignupParamsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
