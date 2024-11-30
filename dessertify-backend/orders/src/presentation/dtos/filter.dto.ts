import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FilterDto {
  @Expose()
  @Type(() => Number) 
  @IsOptional()
  @IsNumber()
  @IsPositive()
  skip?: number;

  @Expose()
  @Type(() => Number) 
  @IsOptional()
  @IsNumber()
  @IsPositive()
  take?: number;
}
