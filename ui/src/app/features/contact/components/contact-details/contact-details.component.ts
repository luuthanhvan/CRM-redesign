import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactApi } from '~features/contact/contact.api';
import { ContactService } from '~features/contact/contact.service';

import { SharedModule } from '~shared/modules/shared.module';

@Component({
  selector: 'app-contact-details',
  imports: [SharedModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit {
  private contactApi = inject(ContactApi);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  protected contactService = inject(ContactService);

  CONTACT_ID = CONTACT_ID;
  contact!: Contact;
  NAVIGATION_PAGES = [
    {
      route: '/contact',
      label: this.translate.instant('contact.title'),
    },
    {
      route: null,
      label: this.translate.instant('contact.contactDetails'),
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const contactId = params.get('contactId') || '';
      this.contactApi.getContact(contactId).subscribe((contact) => {
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
    });
  }
}
