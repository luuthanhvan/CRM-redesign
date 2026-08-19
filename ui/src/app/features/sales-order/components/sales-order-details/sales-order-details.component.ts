import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { SALES_ORDER_ID } from '~features/sales-order/sales-order.constant';
import { SalesOrder } from '~features/sales-order/sales-order.interface';
import { SalesOrderApi } from '~features/sales-order/sales-order.api';
import { SalesOrderService } from '~features/sales-order/sales-order.service';

import { SharedModule } from '~shared/modules/shared.module';

@Component({
  selector: 'app-sales-order-details',
  imports: [SharedModule],
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.scss',
})
export class SalesOrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private salesOrderApi = inject(SalesOrderApi);
  private translate = inject(TranslateService);
  protected salesOrderService = inject(SalesOrderService);

  SALES_ORDER_ID = SALES_ORDER_ID;
  salesOrder!: SalesOrder;
  NAVIGATION_PAGES = [
    {
      route: '/sales-order',
      label: this.translate.instant('salesOrder.title'),
    },
    {
      route: null,
      label: this.translate.instant('salesOrder.salesOrderDetails'),
    },
  ];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const salesOrderId = params.get('salesOrderId') || '';
      this.salesOrderApi.getSalesOrder(salesOrderId).subscribe((data) => {
        if (data) {
          this.salesOrder = data;
        }
      });
    });
  }
}
