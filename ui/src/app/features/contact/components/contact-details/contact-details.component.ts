import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { SafePipe } from '~core/pipes/safe.pipe';

import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactService } from '~features/contact/contact.service';

@Component({
  selector: 'app-contact-details',
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    RouterLink,
    SafePipe,
    TranslateModule,
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit {
  private contactService = inject(ContactService);
  CONTACT_ID = CONTACT_ID;
  contact!: Contact;
  NAVIGATION_PAGES = [
    {
      route: '/contact',
      label: 'Contacts',
    },
    {
      route: null,
      label: 'Contact Details',
    },
  ];

  ngOnInit(): void {
    this.contactService
      .getContact('6a80812e1547609e6a2e30bf')
      .subscribe((contact) => {
        if (contact) {
          this.contact = {
            ...contact,
            mapsURL:
              contact.address !== ''
                ? `https://maps.google.com/maps?q=${contact.address}&t=&z=20&ie=UTF8&iwloc=&output=embed`
                : null,
          };
        }
      });
  }
}
