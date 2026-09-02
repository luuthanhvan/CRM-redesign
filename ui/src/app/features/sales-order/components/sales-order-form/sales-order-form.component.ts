import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { tap } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommonValidator } from '~core/validators/common.validator';

import { Contact } from '~features/contact/contact.interface';
import { ContactApi } from '~features/contact/contact.api';

import {
  SALES_ORDER_ICONS,
  SALES_ORDER_ID,
  SALES_ORDER_STATUSES,
} from '~features/sales-order/sales-order.constant';
import { SalesOrder } from '~features/sales-order/sales-order.interface';
import { SalesOrderApi } from '~features/sales-order/sales-order.api';

import { User } from '~features/user/user.interface';
import { UserApi } from '~features/user/user.api';

import { ToastService } from '~shared/services/toast.service';
import { SharedModule } from '~shared/modules/shared.module';

@Component({
  selector: 'app-sales-order-form',
  imports: [SharedModule],
  templateUrl: './sales-order-form.component.html',
  styleUrl: './sales-order-form.component.scss',
})
export class SalesOrderFormComponent implements OnInit {
  private contactApi = inject(ContactApi);
  private formBuilder = inject(FormBuilder);
  private salesOrderApi = inject(SalesOrderApi);
  private toastService = inject(ToastService);
  private userApi = inject(UserApi);
  protected data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SalesOrderFormComponent>);

  SALES_ORDER_ID = SALES_ORDER_ID;
  icon = SALES_ORDER_ICONS;
  statusNames = SALES_ORDER_STATUSES;

  salesOrderForm!: FormGroup;
  contacts: Contact[] = [];
  assignedToUsers: User[] = [];
  // retain created time when editing Sales order
  createdTime = new Date();

  ngOnInit(): void {
    this.salesOrderForm = this.formBuilder.group({
      contactName: new FormControl('', [Validators.required]),
      subject: new FormControl('', [
        Validators.required,
        CommonValidator.noSpecialCharactersValidator,
      ]),
      status: new FormControl('', [Validators.required]),
      total: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      assignedTo: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });

    this.contactApi.getListOfContactNames().subscribe((data) => {
      if (data) {
        this.contacts = data;
      }
    });

    this.userApi.getListOfUserNames().subscribe((data) => {
      this.assignedToUsers = data || [];
    });

    if (this.data && this.data.action === 'edit') {
      this.getSalesOrderById();
    }
  }

  getSalesOrderById() {
    this.salesOrderApi.getSalesOrder(this.data.orderId).subscribe((data) => {
      data && this.setFormData(data);
    });
  }

  setFormData(data: SalesOrder) {
    this.salesOrderForm.controls['contactName'].setValue(
      data['contactName'] || '',
    );
    this.salesOrderForm.controls['subject'].setValue(data['subject'] || '');
    this.salesOrderForm.controls['status'].setValue(data['status'] || '');
    this.salesOrderForm.controls['total'].setValue(data['total'] || '');
    this.salesOrderForm.controls['assignedTo'].setValue(
      data['assignedTo'] || '',
    );
    this.salesOrderForm.controls['description'].setValue(
      data['description'] || '',
    );
    this.createdTime = data['createdTime'] || new Date();
  }

  onSubmit() {
    const salesOrderInfo: SalesOrder = {
      contactName: this.salesOrderForm.controls['contactName'].value,
      subject: this.salesOrderForm.controls['subject'].value,
      status: this.salesOrderForm.controls['status'].value,
      total: this.salesOrderForm.controls['total'].value,
      assignedTo: this.salesOrderForm.controls['assignedTo'].value,
      description: this.salesOrderForm.controls['description'].value,
      createdTime:
        this.data && this.data.action === 'add' ? new Date() : this.createdTime,
      updatedTime: new Date(),
    };
    if (this.data.action === 'add') {
      this.salesOrderApi
        .addSalesOrder(salesOrderInfo)
        .pipe(
          tap((response) => {
            if (response.isSuccess()) {
              this.toastService.showSuccessMessage(
                'Add new Sales order!',
                this.SALES_ORDER_ID.TOAST_ADD_SUCCESS,
              );
              this.dialogRef.close();
            }
          }),
        )
        .subscribe();
    } else {
      this.salesOrderApi
        .updateSalesOrder(this.data.orderId, salesOrderInfo)
        .pipe(
          tap((response) => {
            if (response.isSuccess()) {
              this.toastService.showSuccessMessage(
                'Update the Sales order!',
                this.SALES_ORDER_ID.TOAST_UPDATE_SUCCESS,
              );
              this.dialogRef.close();
            }
          }),
        )
        .subscribe();
    }
  }

  onCancel() {
    // Close the dialog and pass the data packet back
    this.dialogRef.close('cancel');
  }
}
