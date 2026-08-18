import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import { ApiService } from '~shared/api/services';
import { ResponseItem, ResponseList } from '~shared/types';

import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly apiService = inject(ApiService);
  private stop$: Subject<void> = new Subject<void>();

  createUser(data: User) {
    return this.apiService.post(ENDPOINTS.user.createUser, data);
  }

  getListOfUsers(hasLoading: boolean = false) {
    const headers = hasLoading
      ? {
          skipLoading: `${hasLoading}`,
        }
      : undefined;

    return this.apiService
      .get<ResponseList<User>>(ENDPOINTS.user.userList, undefined, {
        headers,
      })
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
        shareReplay(),
      );
  }

  getListOfUserNames() {
    return this.apiService
      .get<ResponseList<User>>(ENDPOINTS.user.userNamesList, undefined, {
        headers: {
          skipLoading: 'true',
        },
      })
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
      );
  }

  getUser(id: string) {
    return this.apiService
      .get<ResponseItem<User>>(`${ENDPOINTS.user.user}/${id}`, undefined, {
        headers: {
          skipLoading: 'true',
        },
      })
      .pipe(
        map((response) =>
          response.isSuccess() ? response.value.data : undefined,
        ),
        takeUntil(this.stop$),
      );
  }

  updateUser(id: string, data: User) {
    return this.apiService
      .put(`${ENDPOINTS.user.user}/${id}`, data)
      .pipe(takeUntil(this.stop$));
  }
}
