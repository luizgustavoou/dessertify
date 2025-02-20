import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type SigninParams = {
  email: string;
  password: string;
};

export type SigninResponse = {
  access_token: string;
};

export abstract class AuthApi {
  abstract signin(params: SigninParams): Observable<SigninResponse>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiImpl implements AuthApi {
  constructor(private httpClient: HttpClient) {}

  public signin(params: SigninParams): Observable<SigninResponse> {
    const res$ = this.httpClient.post<SigninResponse>(
      'http://localhost:3001/auth/signin',
      params
    );

    return res$;
  }
}
