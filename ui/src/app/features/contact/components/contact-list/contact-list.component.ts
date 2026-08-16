import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
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
import { MatSelectModule } from '@angular/material/select';
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

import { ContactFormComponent } from '~features/contact/components/contact-form/contact-form.component';
import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact, FilterCriteria } from '~features/contact/contact.interface';
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
    RouterLink,
    TranslateModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  @ViewChild(MatPaginator) contactPaginator!: MatPaginator;
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
  leadSources: string[] = [
    'Existing Customer',
    'Partner',
    'Conference',
    'Website',
    'Word of mouth',
    'Other',
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
  searchText: FormControl = new FormControl('');
  search$!: Observable<Contact[] | undefined>;
  filterSubject: BehaviorSubject<FilterCriteria> =
    new BehaviorSubject<FilterCriteria>({});
  currentUserInfo: Record<string, any>;

  constructor(
    private router: Router,
    protected contactService: ContactService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {
    const currentUserInfo = window.localStorage.getItem('currentUser');
    this.currentUserInfo = currentUserInfo && JSON.parse(currentUserInfo);
    if (this.currentUserInfo && this.currentUserInfo['isAdmin']) {
      this.displayedColumns = ['select', ...this.displayedColumns, 'actions'];
    }
    // clear params (leadSrc or assignedTo) before get all data
    this.router.navigateByUrl('/contact', { skipLocationChange: false });
    // get lead source passed from dashboard page
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params['leadSrc']) {
          // this.leadSrcFromDashboard = params['leadSrc'];
          // this.leadSrc = new FormControl(this.leadSrcFromDashboard);
        }
        if (params['assignedTo']) {
          // this.assignedFromDashboard = params['assignedTo'];
          // this.assignedTo = new FormControl(this.assignedFromDashboard);
        }
      }
    });
  }

  ngOnInit(): void {
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
          ? this.contactService.searchContacts({
              contactName,
            })
          : of(undefined),
      ),
    );

    combineLatest([this.contactService.getListOfContacts(), this.search$])
      .pipe(
        map(([contacts, searchResult]) => {
          const sourceData = searchResult || contacts;
          return sourceData;
        }),
      )
      .subscribe((data) => {
        if (data) {
          this.totalRecords = data.length;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.contactPaginator;
        }
      });
  }

  resetData() {
    if (this.searchText.value !== '') {
      this.filterSubject.next({});
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

  onDelete(contactId: string, contactName: string) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
      width: '600px',
    });
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.contactService
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
          this.contactService
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

  applySelectFilter(filterValue: string, filterBy: string) {
    const currentFilterObj = this.filterSubject.getValue();
    this.filterSubject.next({ ...currentFilterObj, [filterBy]: filterValue });
  }
}
