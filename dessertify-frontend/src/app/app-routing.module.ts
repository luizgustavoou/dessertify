import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from '@/presentation/pages/signin/signin.component';
import { HomeComponent } from '@/presentation/pages/home/home.component';
import { AuthGuard } from '@/application/guards/auth.guard';
import { OrdersComponent } from '@/presentation/pages/orders/orders.component';

const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    component: OrdersComponent,
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
