import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { USER_ID } from '~features/user/user.constant';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet],
  providers: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  USER_ID = USER_ID;
}
