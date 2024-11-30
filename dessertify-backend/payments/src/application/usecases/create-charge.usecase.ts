import { Injectable } from '@nestjs/common';

export abstract class CreateChargeUseCase {}

@Injectable()
export class CreateChargeUseCaseImpl extends CreateChargeUseCase {}
