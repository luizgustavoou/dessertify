import {
  IsDefined,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CardDto } from '@/presentation/dtos/card.dto';
import { Type } from 'class-transformer';

export class CreateChargeDto {
  // @IsDefined()
  // @IsNotEmptyObject()
  // @IsObject()
  // @ValidateNested()
  // @Type(() => CardDto)
  // card: CardDto;

  // @IsPositive()
  // amount: number;

  // @IsEmail()
  // email: string;

  @IsUUID()
  orderId: string;
}
