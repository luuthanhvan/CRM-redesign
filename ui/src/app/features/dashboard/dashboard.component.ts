import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

import { TranslateModule } from '@ngx-translate/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBagShopping,
  faHandHoldingDollar,
  faUserTag,
} from '@fortawesome/free-solid-svg-icons';

import { DASHBOARD_ID } from '~features/dashboard/dashboard.constant';
import { ContactApi } from '~features/contact/contact.api';
import { SalesOrderService } from '~features/sales-order/sales-order.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    BaseChartDirective,
    CommonModule,
    FontAwesomeModule,
    MatCardModule,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) contactChart!: BaseChartDirective;
  @ViewChild(BaseChartDirective) salesOrderChart!: BaseChartDirective;
  contactApi = inject(ContactApi);
  salesOrderService = inject(SalesOrderService);

  DASHBOARD_ID = DASHBOARD_ID;
  icon = {
    faBagShopping,
    faHandHoldingDollar,
    faUserTag,
  };

  // Doughnut chart for contact
  contactPieChartLabels: string[] = [
    'Existing Customer',
    'Partner',
    'Conference',
    'Website',
    'Word of mouth',
    'Other',
  ];
  contactPieChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
  };
  contactPieChartDatasets = [
    {
      data: [0, 0, 0, 0, 0, 0],
    },
  ];

  // Doughnut chart for Sales order
  salesOrderPieChartLabels: string[] = [
    'Created',
    'Approved',
    'Delivered',
    'Canceled',
  ];
  salesOrderPieChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
  };
  salesOrderPieChartDatasets = [
    {
      data: [0, 0, 0, 0, 0, 0],
    },
  ];

  // lineChart (dump data)
  lineChartData: Array<any> = [
    { data: [213, 22, 0, 0, 0, 0, 2324], label: 'Total' },
  ];
  lineChartLabels: Array<any> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  lineChartOptions: any = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    },
  };

  totalContacts = 0;
  totalSalesOrders = 0;
  totalRevenue = 0;

  ngOnInit(): void {
    this.loadContactChartData();
    this.loadSalesOrderChartData();
  }

  loadContactChartData() {
    this.contactApi.countContacts('lead-source').subscribe((data: any) => {
      if (data) {
        this.contactPieChartDatasets = [...this.contactPieChartDatasets];
        const contactCount = data['contactCount'];
        this.totalContacts = data['totalContacts'];
        contactCount.forEach((item: { [key: string]: any }) => {
          const index = this.contactPieChartLabels.indexOf(item['_id']);
          this.contactPieChartDatasets[0].data[index] = item['count'];
        });
        // Force chart update
        this.contactChart.update();
      }
    });
  }

  loadSalesOrderChartData() {
    this.salesOrderService.countSalesOrder('status').subscribe((data: any) => {
      if (data) {
        this.salesOrderPieChartDatasets = [...this.salesOrderPieChartDatasets];
        const salesOrderCount = data['salesOrderCount'];
        this.totalSalesOrders = data['totalSalesOrders'];
        this.totalRevenue = data['totalRevenue'];
        salesOrderCount.forEach((item: { [key: string]: any }) => {
          const index = this.salesOrderPieChartLabels.indexOf(item['_id']);
          this.salesOrderPieChartDatasets[0].data[index] = item['count'];
        });
        // Force chart update
        this.salesOrderChart.update();
      }
    });
  }
}
