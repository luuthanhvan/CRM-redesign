import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { SALES_ORDER_ID } from '~features/sales-order/sales-order.constant';
import { SalesOrder } from '~features/sales-order/sales-order.interface';
import { SalesOrderApi } from '~features/sales-order/sales-order.api';
import { SalesOrderService } from '~features/sales-order/sales-order.service';

@Component({
  selector: 'app-sales-order-details',
  imports: [
    CommonModule,
    DecimalPipe,
    MatButtonModule,
    MatListModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.scss',
})
export class SalesOrderDetailsComponent implements OnInit {
  private router = inject(Router);
  private salesOrderApi = inject(SalesOrderApi);
  protected salesOrderService = inject(SalesOrderService);
  
  SALES_ORDER_ID = SALES_ORDER_ID;
  salesOrder!: SalesOrder;
  NAVIGATION_PAGES = [
    {
      route: '/sales-order',
      label: 'Sales Orders',
    },
    {
      route: null,
      label: 'Sales Order Details',
    },
  ];
  routeStateData: { [k: string]: any } | undefined;

  constructor() {
    const currentNav = this.router.getCurrentNavigation();
    this.routeStateData = currentNav?.extras.state;
  }

  ngOnInit(): void {
    this.salesOrderApi
      .getSalesOrder(this.routeStateData?.['salesOrderId'])
      .subscribe((data) => {
        if (data) {
          this.salesOrder = data;
        }
      });
  }
}
