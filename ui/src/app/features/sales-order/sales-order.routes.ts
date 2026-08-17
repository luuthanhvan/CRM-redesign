import { Routes } from '@angular/router';
import { SalesOrderComponent } from './sales-order.component';
import { SalesOrderDetailsComponent } from './components/sales-order-details/sales-order-details.component';
import { SalesOrderListComponent } from './components/sales-order-list/sales-order-list.component';

export const salesOrderRoutes: Routes = [
  {
    path: '',
    component: SalesOrderComponent,
    children: [
      { path: '', component: SalesOrderListComponent }, // default content when landing in sales orders page
      { path: 'sales-order-details', component: SalesOrderDetailsComponent },
    ],
  },
];
