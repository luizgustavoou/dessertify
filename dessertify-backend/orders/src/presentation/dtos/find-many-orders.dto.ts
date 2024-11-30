import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { FilterDto } from '@/presentation/dtos/filter.dto';

export class FindManyOrdersQueryDto extends FilterDto {
  @Expose()
  @IsOptional()
  @IsUUID()
  customerId?: string;
}
