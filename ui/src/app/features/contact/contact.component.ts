import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CONTACT_ID } from '~features/contact/contact.constant';

@Component({
  selector: 'app-contact',
  imports: [RouterOutlet],
  providers: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  CONTACT_ID = CONTACT_ID;
}
