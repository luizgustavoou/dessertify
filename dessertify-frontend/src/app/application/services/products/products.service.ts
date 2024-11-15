import { HttpClient } from '@angular/common/http';
import { Product } from '../../../domain/entities/products';
import { delay, firstValueFrom, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export abstract class ProductsService {
  abstract getProducts(): Observable<Product[]>;
}

@Injectable()
export class ProductsServiceImpl implements ProductsService {
  constructor(private httpClient: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    const products$ = this.httpClient
      .get<Product[]>('/assets/data.json')
      .pipe(delay(700));

    return products$;
  }
}
