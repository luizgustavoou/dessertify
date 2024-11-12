import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsServiceImpl } from './application/services/products/products.service';
import { ProductsService } from './application/services/products/products.service';
import { AppButtonComponent } from './ui/atoms/app-button/app-button.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { CartComponent } from './ui/organisms/cart/cart.component';
import { DessertsListComponent } from './ui/organisms/desserts-list/desserts-list.component';
import { StoreModule } from '@ngrx/store';
import { AppState } from './application/states/app.state';
import { cartReducer } from './application/reducers/cart.reducer';

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
  ],
  providers: [
    provideHttpClient(),
    {
      provide: ProductsService,
      useClass: ProductsServiceImpl,
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
