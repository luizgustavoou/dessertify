import {
  HashProvider,
  TCompareParams,
  TCompareResponse,
  THashParams,
  THashResponse,
} from '@/domain/contracts/providers/hash-provider.contract';

import * as bcrypt from 'bcrypt';

export class BcryptHashProvider implements HashProvider {
  async hash(params: THashParams): Promise<THashResponse> {
    const saltOrRounds = 10;

    const hash = await bcrypt.hash(params.content, saltOrRounds);

    return hash;
  }

  async compare(params: TCompareParams): Promise<TCompareResponse> {
    const result = await bcrypt.compare(params.password, params.hashPassword);

    return result;
  }
}
