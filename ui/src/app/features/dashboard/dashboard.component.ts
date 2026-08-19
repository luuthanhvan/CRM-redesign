import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

import { ContactApi } from '~features/contact/contact.api';
import {
  DASHBOARD_ICONS,
  DASHBOARD_ID,
} from '~features/dashboard/dashboard.constant';
import { SalesOrderApi } from '~features/sales-order/sales-order.api';

import { SharedModule } from '~shared/modules/shared.module';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) contactChart!: BaseChartDirective;
  @ViewChild(BaseChartDirective) salesOrderChart!: BaseChartDirective;

  private contactApi = inject(ContactApi);
  private salesOrderApi = inject(SalesOrderApi);

  DASHBOARD_ID = DASHBOARD_ID;
  icon = DASHBOARD_ICONS;

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

  contactCount = [];
  salesOrderCount = [];
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
        this.contactCount = data['contactCount'];
        this.totalContacts = data['totalContacts'];
        this.contactCount.forEach((item: { [key: string]: any }) => {
          const index = this.contactPieChartLabels.indexOf(item['_id']);
          this.contactPieChartDatasets[0].data[index] = item['count'];
        });
        // Force chart update
        this.contactChart.update();
      }
    });
  }

  loadSalesOrderChartData() {
    this.salesOrderApi.countSalesOrder('status').subscribe((data: any) => {
      if (data) {
        this.salesOrderPieChartDatasets = [...this.salesOrderPieChartDatasets];
        this.salesOrderCount = data['salesOrderCount'];
        this.totalSalesOrders = data['totalSalesOrders'];
        this.totalRevenue = data['totalRevenue'];
        this.salesOrderCount.forEach((item: { [key: string]: any }) => {
          const index = this.salesOrderPieChartLabels.indexOf(item['_id']);
          this.salesOrderPieChartDatasets[0].data[index] = item['count'];
        });
        // Force chart update
        this.salesOrderChart.update();
      }
    });
  }
}
