import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faPencil,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';
import { ToastService } from '~shared/services/toast.service';

import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactApi } from '~features/contact/contact.api';
import { ContactFormComponent } from '~features/contact/components/contact-form/contact-form.component';
import { ContactService } from '~features/contact/contact.service';

@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatButton,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    NoDataFoundComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  @ViewChild(MatPaginator) contactPaginator!: MatPaginator;
  private contactApi = inject(ContactApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);
  public dialog = inject(MatDialog);
  public contactService = inject(ContactService);

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
  icon = {
    faMagnifyingGlass,
    faPencil,
    faPlus,
    faTrashCan,
    faXmark,
  };
  dataSource = new MatTableDataSource<Contact>([]);
  totalRecords: number = 0;
  contactIdsChecked: string[] = [];
  leadSourceList: string[] = [];
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
    // clear params (leadSrc) before get all data
    // this.router.navigateByUrl('/contact', { skipLocationChange: false });
    // get lead source passed from dashboard page
    // this.route.queryParams.subscribe((params) => {
    //   if (params) {
    //     if (params['leadSrc']) {
    //       this.leadSrcFromDashboard = params['leadSrc'];
    //       this.leadSrc = new FormControl(this.leadSrcFromDashboard);
    //     }
    //   }
    // });
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
    this.contactApi
      .searchContacts({
        contactName: this.searchText.value,
        leadSource: event.value.toString(),
      })
      .subscribe((contactData) => {
        if (contactData) {
          this.setTableData(contactData);
        }
      });
  }

  navigateToSubScreen(screen: string, data: {}) {
    this.router.navigate([screen], {
      state: data,
    });
  }
}
