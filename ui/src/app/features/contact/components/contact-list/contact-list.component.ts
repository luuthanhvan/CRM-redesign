import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';

import { CONTACT_ICONS, CONTACT_ID } from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactApi } from '~features/contact/contact.api';
import { ContactFormComponent } from '~features/contact/components/contact-form/contact-form.component';
import { ContactService } from '~features/contact/contact.service';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';

import { SharedModule } from '~shared/modules/shared.module';

import { CommonService } from '~shared/services/common.service';
import { ToastService } from '~shared/services/toast.service';

@Component({
  selector: 'app-contact-list',
  imports: [SharedModule, NoDataFoundComponent],
  providers: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  @ViewChild(MatPaginator) contactPaginator!: MatPaginator;

  private contactApi = inject(ContactApi);
  private toastService = inject(ToastService);
  protected commonService = inject(CommonService);
  protected contactService = inject(ContactService);
  public dialog = inject(MatDialog);

  CONTACT_ID = CONTACT_ID;
  displayedColumns: string[] = [
    'contactName',
    'salutation',
    'organization',
    'leadSrc',
    'phone',
    'email',
    'assignedTo',
  ];
  icon = CONTACT_ICONS;

  dataSource = new MatTableDataSource<Contact>([]);
  totalRecords: number = 0;
  contactIdsChecked: string[] = [];
  leadSourceList: string[] = [];
  selectedLeadSrc: string[] = [];
  searchText: FormControl = new FormControl('');
  leadSource: FormControl = new FormControl('');
  search$!: Observable<Contact[] | undefined>;
  currentUserInfo: Record<string, any>;

  constructor() {
    const currentUserInfo = window.localStorage.getItem('currentUser');
    this.currentUserInfo = currentUserInfo && JSON.parse(currentUserInfo);
    if (this.currentUserInfo && this.currentUserInfo['isAdmin']) {
      this.displayedColumns = ['select', ...this.displayedColumns, 'actions'];
    }
  }

  ngOnInit(): void {
    this.leadSourceList = this.contactService.getLeadSrc();
    this.loadData();
  }

  loadData() {
    this.search$ = this.searchText.valueChanges.pipe(
      startWith(''),
      tap((contactName) => {
        // handle the search value before doing any further steps
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((contactName) =>
        contactName
          ? this.contactApi.searchContacts({
              contactName,
              ...(this.selectedLeadSrc.length > 0 && {
                leadSource: this.selectedLeadSrc.toString(),
              }),
            })
          : of(undefined),
      ),
    );

    combineLatest([this.contactApi.getListOfContacts(), this.search$])
      .pipe(
        map(([contacts, searchResult]) => {
          const sourceData = searchResult || contacts;
          return sourceData;
        }),
      )
      .subscribe((contactData) => {
        if (contactData) {
          this.setTableData(contactData);
        }
      });
  }

  setTableData(data: Contact[]) {
    this.totalRecords = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.contactPaginator;
  }

  resetData() {
    if (this.searchText.value !== '') {
      this.searchText = new FormControl('');
      this.loadData();
    }
  }

  openFormDialog(action: string, contactId?: string) {
    const formDialogRef = this.dialog.open(ContactFormComponent, {
      disableClose: true,
      width: '900px',
      maxWidth: '900px',
      minWidth: '560px',
      data: {
        action,
        contactId,
      },
    });
    formDialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  onDelete(contactId: string) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
      width: '600px',
    });
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.contactApi
            .deleteContact(contactId)
            .pipe(
              tap((response) => {
                if (response.isSuccess()) {
                  this.toastService.showSuccessMessage(
                    'Delete the Contact!',
                    this.CONTACT_ID.TOAST_DELETE_SUCCESS,
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Contact!',
                    this.CONTACT_ID.TOAST_DELETE_FAILED,
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
      this.loadData();
    });
  }

  onBulkDeleteContacts() {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
      width: '600px',
    });
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.contactApi
            .bulkDeleteContacts(this.contactIdsChecked)
            .pipe(
              tap((response) => {
                if (response.isSuccess()) {
                  this.toastService.showSuccessMessage(
                    'Delete the Contacts!',
                    this.CONTACT_ID.TOAST_DELETE_MULTIPLE_SUCCESS,
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Contacts!',
                    this.CONTACT_ID.TOAST_DELETE_MULTIPLE_SUCCESS,
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
      this.contactIdsChecked = [];
      this.loadData();
    });
  }

  onCheckboxChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const contactId = (event.target as HTMLInputElement).value;
    if (isChecked) {
      // add the checked value to array
      this.contactIdsChecked.push(contactId);
    } else {
      // remove the unchecked value from array
      this.contactIdsChecked.splice(
        this.contactIdsChecked.indexOf(contactId),
        1,
      );
    }
  }

  onLeadSrcChange(event: MatSelectChange) {
    this.selectedLeadSrc = event.value;
    this.contactApi
      .searchContacts({
        ...(this.searchText.value !== '' && {
          contactName: this.searchText.value,
        }),
        leadSource: this.selectedLeadSrc.toString(),
      })
      .subscribe((contactData) => {
        if (contactData) {
          this.setTableData(contactData);
        }
      });
  }

  onDownloadAllContacts() {
    this.contactApi.exportAllContacts().subscribe({
      next: (blobData: Blob) => {
        this.commonService.downloadReport(blobData, 'contact_details_all.csv');
      },
      error: () => {
        this.toastService.showErrorMessage('Cannot download the report file!');
      },
    });
  }
}
