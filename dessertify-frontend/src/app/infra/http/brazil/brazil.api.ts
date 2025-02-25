import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export type CEPParams = {
  cep: string;
};

export type TCEPResult = {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

export abstract class BrazilApi {
  abstract cep(params: CEPParams): Observable<TCEPResult>;
}

@Injectable()
export class BrazilApiImpl implements BrazilApi {
  constructor(private httpClient: HttpClient) {}

  public cep(params: CEPParams): Observable<TCEPResult> {
    return this.httpClient.get<TCEPResult>(
      `https://viacep.com.br/ws/${params.cep}/json/`
    );
  }
}
