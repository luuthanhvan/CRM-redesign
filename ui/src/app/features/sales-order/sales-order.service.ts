import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private statuses = [
    {
      label: 'Created',
      color: 'orange',
    },
    {
      label: 'Approved',
      color: 'green',
    },
    {
      label: 'Delivered',
      color: 'teal',
    },
    {
      label: 'Canceled',
      color: 'maroon',
    },
  ];

  getStatusBadgeColor(status: string) {
    return this.statuses.find((item) => item.label === status)?.color;
  }

  getStatuses() {
    return this.statuses.map((item) => item.label);
  }
}
