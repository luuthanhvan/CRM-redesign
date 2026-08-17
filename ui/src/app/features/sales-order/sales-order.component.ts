import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SALES_ORDER_ID } from '~features/sales-order/sales-order.constant';

@Component({
  selector: 'app-sales-order',
  imports: [RouterOutlet],
  providers: [],
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.scss',
})
export class SalesOrderComponent {
  SALES_ORDER_ID = SALES_ORDER_ID;
}
