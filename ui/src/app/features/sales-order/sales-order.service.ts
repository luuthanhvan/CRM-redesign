import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import { ApiService } from '~shared/api/services';
import { ResponseItem, ResponseList } from '~shared/types';

import { SalesOrder } from './sales-order.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private readonly apiService = inject(ApiService);
  private stop$: Subject<void> = new Subject<void>();

  addSalesOrder(data: SalesOrder) {
    return this.apiService.post(ENDPOINTS.salesOrder.salesOrder, data);
  }

  bulkDeleteSalesOrder(ids: string[]) {
    return this.apiService
      .post(ENDPOINTS.salesOrder.bulkDeleteSalesOrders, ids, undefined, {
        headers: {
          skipLoading: 'true',
        },
      })
      .pipe(takeUntil(this.stop$));
  }

  countSalesOrder(countBy: string) {
    return this.apiService
      .get<ResponseList>(`${ENDPOINTS.salesOrder.countSalesOrder}/${countBy}`)
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined
        ),
        takeUntil(this.stop$)
      );
  }

  deleteSalesOrder(id: string) {
    return this.apiService
      .delete(`${ENDPOINTS.salesOrder.salesOrder}/${id}`, undefined, {
        headers: {
          skipLoading: 'true',
        },
      })
      .pipe(takeUntil(this.stop$));
  }

  getListOfSalesOrders() {
    return this.apiService
      .get<ResponseList<SalesOrder>>(ENDPOINTS.salesOrder.salesOrderList)
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined
        ),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  getSalesOrder(id: string) {
    return this.apiService
      .get<ResponseItem<SalesOrder>>(
        `${ENDPOINTS.salesOrder.salesOrder}/${id}`,
        undefined,
        {
          headers: {
            skipLoading: 'true',
          },
        }
      )
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined
        ),
        takeUntil(this.stop$)
      );
  }

  searchSalesOrders(params: Record<string, string>) {
    return this.apiService
      .get<ResponseList<SalesOrder>>(
        ENDPOINTS.salesOrder.searchSalesOrder,
        params
      )
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined
        ),
        takeUntil(this.stop$)
      );
  }

  updateSalesOrder(id: string, data: SalesOrder) {
    return this.apiService
      .put(`${ENDPOINTS.salesOrder.salesOrder}/${id}`, data)
      .pipe(takeUntil(this.stop$));
  }
}
