import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDownload,
  faMagnifyingGlass,
  faPencil,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';

import { USER_ID } from '~features/user/user.constant';
import { User } from '~features/user/user.interface';
import { UserApi } from '~features/user/user.api';
import { UserFormComponent } from '~features/user/components/user-form/user-form.component';
import { UserService } from '~features/user/user.service';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatButton,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableModule,
    NoDataFoundComponent,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) userPaginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  private userService = inject(UserService);
  private userApi = inject(UserApi);

  USER_ID = USER_ID;
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'role',
    'status',
    'createdTime',
    // 'actions',
  ];
  icon = {
    faDownload,
    faMagnifyingGlass,
    faPencil,
    faPlus,
    faTrashCan,
    faXmark,
  };
  dataSource = new MatTableDataSource<User>([]);
  totalRecords: number = 0;

  constructor() {
    this.dataSource.paginator = this.userPaginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.userApi.getListOfUsers(true).subscribe((data) => {
      if (data) {
        this.totalRecords = data.length;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.userPaginator;
      }
    });
  }

  openUserDialog(action: string, userId?: string) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      disableClose: true,
      width: '900px',
      maxWidth: '900px',
      minWidth: '560px',
      data: {
        action,
        userId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // reload list of users after close the dialog
      this.loadData();
    });
  }
}
