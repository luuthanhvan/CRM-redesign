import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import {
  SALES_ORDER_ICONS,
  SALES_ORDER_ID,
} from '~features/sales-order/sales-order.constant';
import { SalesOrder } from '~features/sales-order/sales-order.interface';
import { SalesOrderApi } from '~features/sales-order/sales-order.api';
import { SalesOrderFormComponent } from '~features/sales-order/components/sales-order-form/sales-order-form.component';
import { SalesOrderService } from '~features/sales-order/sales-order.service';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';

import { SharedModule } from '~shared/modules/shared.module';

import { ToastService } from '~shared/services/toast.service';
import { CommonService } from '~shared/services/common.service';

@Component({
  selector: 'app-sales-order-list',
  imports: [SharedModule, NoDataFoundComponent],
  providers: [],
  templateUrl: './sales-order-list.component.html',
  styleUrl: './sales-order-list.component.scss',
})
export class SalesOrderListComponent implements OnInit {
  @ViewChild(MatPaginator) salesOrderPaginator!: MatPaginator;

  private salesOrderApi = inject(SalesOrderApi);
  private toastService = inject(ToastService);
  protected commonService = inject(CommonService);
  protected salesOrderService = inject(SalesOrderService);
  public dialog = inject(MatDialog);

  SALES_ORDER_ID = SALES_ORDER_ID;
  displayedColumns: string[] = [
    'subject',
    'contactName',
    'status',
    'total',
    'assignedTo',
  ];
  icon = SALES_ORDER_ICONS;

  dataSource = new MatTableDataSource<SalesOrder>([]);
  totalRecords: number = 0;
  searchText: FormControl = new FormControl('');
  search$!: Observable<SalesOrder[] | undefined>;
  orderIdsChecked: string[] = [];
  currentUserInfo: Record<string, any>;

  pageSize = 10;
  pageIndex = 0;

  constructor() {
    const currentUserInfo = window.localStorage.getItem('currentUser');
    this.currentUserInfo = currentUserInfo && JSON.parse(currentUserInfo);
    if (this.currentUserInfo && this.currentUserInfo['isAdmin']) {
      this.displayedColumns = ['select', ...this.displayedColumns, 'actions'];
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.search$ = this.searchText.valueChanges.pipe(
      startWith(''),
      tap((subject) => {
        // handle the search value before doing any futher steps
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((subject) =>
        subject
          ? this.salesOrderApi.searchSalesOrders({
              ...(subject !== '' && { subject }),
            })
          : of(undefined),
      ),
    );
    const salesOrders$ = this.salesOrderApi.getListOfSalesOrders({
      page: this.pageIndex + 1,
      limit: this.pageSize,
    });

    combineLatest([salesOrders$, this.search$])
      .pipe(map(([salesOrder, searchResult]) => searchResult || salesOrder))
      .subscribe((responseData) => {
        if (responseData) {
          this.setTableData(responseData);
        }
      });
  }

  setTableData(data: Record<string, any>) {
    this.totalRecords = data['totalRecords'];
    this.dataSource = data['salesOrders'];
  }

  resetFilterData() {
    if (this.searchText.value !== '') {
      this.searchText = new FormControl('');
    }
  }

  resetPagination() {
    this.pageIndex = 0;
    this.pageSize = 10;
  }

  openFormDialog(action: string, orderId?: string) {
    const formDialogRef = this.dialog.open(SalesOrderFormComponent, {
      disableClose: true,
      width: '900px',
      maxWidth: '900px',
      minWidth: '560px',
      data: {
        action,
        orderId,
      },
    });
    formDialogRef.afterClosed().subscribe((result) => {
      if (result !== 'cancel') {
        this.resetFilterData();
        this.resetPagination();
        this.loadData();
      }
    });
  }

  onDelete(orderId: string) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
      width: '600px',
    });
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.salesOrderApi
            .deleteSalesOrder(orderId)
            .pipe(
              tap((response) => {
                if (response.isSuccess()) {
                  this.toastService.showSuccessMessage(
                    'Delete the Sales order!',
                  );
                } else {
                  this.toastService.showErrorMessage('Delete the Sales order!');
                }
              }),
            )
            .subscribe(() => {
              confirmDialogRef.close();
            });
        }
      },
    );
    confirmDialogRef.afterClosed().subscribe((result) => {
      if (result !== 'cancel') {
        this.resetFilterData();
        this.resetPagination();
        this.loadData();
      }
    });
  }

  onBulkDeleteSalesOrders() {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
      width: '600px',
    });
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.salesOrderApi
            .bulkDeleteSalesOrder(this.orderIdsChecked)
            .pipe(
              tap((response) => {
                if (response.isSuccess()) {
                  this.toastService.showSuccessMessage(
                    'Delete the Sales orders!',
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Sales orders!',
                  );
                }
              }),
            )
            .subscribe(() => {
              confirmDialogRef.close();
            });
        }
      },
    );
    confirmDialogRef.afterClosed().subscribe((result) => {
      if (result !== 'cancel') {
        this.orderIdsChecked = [];
        this.resetFilterData();
        this.resetPagination();
        this.loadData();
      }
    });
  }

  onCheckboxChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const orderId = (event.target as HTMLInputElement).value;
    if (isChecked) {
      // add the checked value to array
      this.orderIdsChecked.push(orderId);
    } else {
      // remove the unchecked value from array
      this.orderIdsChecked.splice(this.orderIdsChecked.indexOf(orderId), 1);
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}
