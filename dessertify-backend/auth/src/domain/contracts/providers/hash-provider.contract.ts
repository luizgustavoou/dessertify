export abstract class HashProvider {
  abstract hash(params: THashParams): Promise<THashResponse>;
  abstract compare(params: TCompareParams): Promise<TCompareResponse>;
}

export type THashParams = {
  content: string;
};

export type THashResponse = string;

export type TCompareParams = {
  password: string;
  hashPassword: string;
};

export type TCompareResponse = boolean;
