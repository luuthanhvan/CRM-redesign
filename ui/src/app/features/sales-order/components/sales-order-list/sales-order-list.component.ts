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
import { MatPaginator } from '@angular/material/paginator';
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
          ? this.salesOrderApi.searchSalesOrders({ subject })
          : of(undefined),
      ),
    );

    combineLatest([this.salesOrderApi.getListOfSalesOrders(), this.search$])
      .pipe(map(([salesOrder, searchResult]) => searchResult || salesOrder))
      .subscribe((data) => {
        if (data) {
          this.totalRecords = data.length;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.salesOrderPaginator;
        }
      });
  }

  resetData() {
    this.searchText = new FormControl('');
    this.loadData();
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
      this.loadData();
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
      this.loadData();
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
      this.orderIdsChecked = [];
      this.loadData();
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
}
