import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '@/domain/models/products';

export abstract class ProductsApi {
  abstract getProducts(): Observable<Product[]>;
}

@Injectable()
export class ProductsApiImpl implements ProductsApi {
  constructor(private httpClient: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    const products$ = this.httpClient
      .get<Product[]>('/assets/data.json')
      .pipe(delay(700));

    return products$;
  }
}
