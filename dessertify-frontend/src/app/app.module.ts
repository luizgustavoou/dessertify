import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from '@/app-routing.module';
import { AppComponent } from '@/app.component';
import { ProductsApi } from '@/infra/http/products/products.api';
import { ProductsApiImpl } from '@/infra/http/products/products.api';
import { AppButtonComponent } from '@/presentation/atoms/app-button/app-button.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { CartComponent } from '@/presentation/organisms/cart/cart.component';
import { DessertsListComponent } from '@/presentation/organisms/desserts-list/desserts-list.component';
import { StoreModule } from '@ngrx/store';
import { AppState } from '@/application/state/app.state';
import { cartReducer } from '@/application/state/reducers/cart.reducer';
import { NgxStripeModule } from 'ngx-stripe';
import { OrdersApi, OrdersApiImpl } from '@/infra/http/orders/orders.api';
import { AuthApi, AuthApiImpl } from '@/infra/http/auth/auth.api';
import { FormsModule } from '@angular/forms';
import { authReducer } from '@/application/state/reducers/auth.reducer';
import { AuthGuard } from '@/application/guards/auth.guard';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '@/application/state/effects/auth.effects';
import { environment } from '../environments/environment';
import { BrazilApi, BrazilApiImpl } from '@/infra/http/brazil/brazil.api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AppButtonComponent,
    MatIconModule,
    CartComponent,
    DessertsListComponent,
    StoreModule.forRoot<AppState>({ cart: cartReducer, auth: authReducer }, {}),
    EffectsModule.forRoot([AuthEffects]),

    NgxStripeModule.forRoot(environment.STRIPE_PUBLISHABLE_KEY),
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
    {
      provide: AuthApi,
      useClass: AuthApiImpl,
    },
    {
      provide: BrazilApi,
      useClass: BrazilApiImpl,
    },
    provideAnimationsAsync(),
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
