import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import { ApiService } from '~shared/api/services';
import { ResponseList, ResponseItem } from '~shared/types';

import type { Contact } from './contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactApi {
  private readonly http = inject(HttpClient);
  private readonly apiService = inject(ApiService);
  private stop$: Subject<void> = new Subject<void>();

  addContact(data: Contact) {
    return this.apiService.post<Contact>(ENDPOINTS.contact.contact, data);
  }

  bulkDeleteContacts(ids: string[]) {
    return this.apiService
      .post(ENDPOINTS.contact.bulkDeleteContacts, ids, undefined, {
        headers: {
          skipLoading: 'true',
        },
      })
      .pipe(takeUntil(this.stop$));
  }

  countContacts(countBy: string) {
    return this.apiService
      .get<ResponseList>(`${ENDPOINTS.contact.countContact}/${countBy}`)
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
      );
  }

  deleteContact(contactId: string) {
    return this.apiService
      .delete(`${ENDPOINTS.contact.contact}/${contactId}`, undefined, {
        headers: {
          skipLoading: 'true',
        },
      })
      .pipe(takeUntil(this.stop$));
  }

  getContact(id: string) {
    return this.apiService
      .get<ResponseItem<Contact>>(
        `${ENDPOINTS.contact.contact}/${id}`,
        undefined,
        {
          headers: {
            skipLoading: 'true',
          },
        },
      )
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
      );
  }

  getListOfContacts(params: Record<string, any>) {
    return this.apiService
      .get<ResponseList<Contact>>(ENDPOINTS.contact.contactList, params)
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
        shareReplay(),
      );
  }

  getListOfContactNames() {
    return this.apiService
      .get<ResponseList<Contact>>(
        ENDPOINTS.contact.contactNameList,
        undefined,
        {
          headers: {
            skipLoading: 'true',
          },
        },
      )
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
      );
  }

  searchContacts(params: Record<string, string>) {
    return this.apiService
      .get<ResponseList<Contact>>(ENDPOINTS.contact.searchContact, params)
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
      );
  }

  updateContact(id: string, contact: Contact) {
    return this.apiService
      .put(`${ENDPOINTS.contact.contact}/${id}`, contact)
      .pipe(takeUntil(this.stop$));
  }

  exportAllContacts() {
    return this.http.get(ENDPOINTS.contact.exportAllContacts, {
      responseType: 'blob',
    });
  }
}
