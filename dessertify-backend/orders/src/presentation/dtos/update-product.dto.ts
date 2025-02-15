import { CreateProductDto } from '@/presentation/dtos/create-product.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
