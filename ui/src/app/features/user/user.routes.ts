import { Routes } from '@angular/router';
import { UserComponent } from '~features/user/user.component';
import { UserListComponent } from '~features/user/components/user-list/user-list.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', component: UserListComponent }, // default content when landing in users page
    ],
  },
];
