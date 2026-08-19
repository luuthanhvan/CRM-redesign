import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';

import { USER_ICONS, USER_ID } from '~features/user/user.constant';
import { User } from '~features/user/user.interface';
import { UserApi } from '~features/user/user.api';
import { UserFormComponent } from '~features/user/components/user-form/user-form.component';

import { SharedModule } from '~shared/modules/shared.module';

@Component({
  selector: 'app-user-list',
  imports: [NoDataFoundComponent, SharedModule],
  providers: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) userPaginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  private userApi = inject(UserApi);

  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'role',
    'status',
    'createdTime',
    'actions',
  ];
  USER_ID = USER_ID;
  icon = USER_ICONS;
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
