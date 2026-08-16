import { Routes } from '@angular/router';
import { AuthGuard } from '~core/guards/auth.guard';

import { contactRoutes } from '~features/contact/contact.routes';
import { DashboardComponent } from '~features/dashboard/dashboard.component';
import { HomeComponent } from '~core/layout/home/home.component';
import { LoginComponent } from '~features/authentication/pages/login/login.component';
import { SalesOrderComponent } from '~features/sales-order/sales-order.component';
import { UserComponent } from '~features/user/user.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard], // require for load sign-in page first
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'contact',
        children: contactRoutes,
      },
      { path: 'sales-order', component: SalesOrderComponent },
      { path: 'user', component: UserComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
