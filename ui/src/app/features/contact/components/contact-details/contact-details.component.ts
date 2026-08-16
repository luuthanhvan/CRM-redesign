import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { SafePipe } from '~core/pipes/safe.pipe';

import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactApi } from '~features/contact/contact.api';
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
  private router = inject(Router);
  private contactApi = inject(ContactApi);
  public contactService = inject(ContactService);

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
  routeStateData: { [k: string]: any } | undefined;

  constructor() {
    const currentNav = this.router.getCurrentNavigation();
    this.routeStateData = currentNav?.extras.state;
  }

  ngOnInit(): void {
    this.contactApi
      .getContact(this.routeStateData?.['contactId'])
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
