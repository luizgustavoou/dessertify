import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninParamsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
