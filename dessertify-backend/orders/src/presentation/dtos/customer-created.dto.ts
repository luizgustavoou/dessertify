import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CustomerCreatedDto {
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
