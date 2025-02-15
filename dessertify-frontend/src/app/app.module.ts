import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsApi } from '@/infra/http/products/products.api';
import { ProductsApiImpl } from '@/infra/http/products/products.api';
import { AppButtonComponent } from './presentation/atoms/app-button/app-button.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { CartComponent } from './presentation/organisms/cart/cart.component';
import { DessertsListComponent } from './presentation/organisms/desserts-list/desserts-list.component';
import { StoreModule } from '@ngrx/store';
import { AppState } from '@/application/state/app.state';
import { cartReducer } from '@/application/state/reducers/cart.reducer';
import { NgxStripeModule } from 'ngx-stripe';
import { CheckoutFormComponent } from '@/presentation/organisms/teste-stripe/checkout-form.component';
import { OrdersApi, OrdersApiImpl } from '@/infra/http/orders/orders.api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppButtonComponent,
    MatIconModule,
    CartComponent,
    DessertsListComponent,
    StoreModule.forRoot<AppState>({ cart: cartReducer }, {}),
    NgxStripeModule.forRoot(
      'pk_test_51Q73ToCkffGxKcXJQehaae3GKGFgro8XeDLCFcWsPPfJX5Onx4bfy2UG3pP3sIpkcHQ2cgAbyZArcAKcpNYCzRBI00kkwY57UQ'
    ),
    CheckoutFormComponent,
  ],
  providers: [
    provideHttpClient(),
    {
      provide: ProductsApi,
      useClass: ProductsApiImpl,
    },
    {
      provide: OrdersApi,
      useClass: OrdersApiImpl,
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
