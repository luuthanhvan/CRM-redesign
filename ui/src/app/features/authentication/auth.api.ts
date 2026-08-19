import { Injectable, inject } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import { EndpointService } from '~shared/services/endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly endpointService = inject(EndpointService);
  private user$ = new BehaviorSubject<any | null>(null);

  login(username: string, password: string, paramsArr?: any[]) {
    const headerOptions = [{ name: 'NoAuth', value: 'True' }];
    return this.endpointService.addEndpoint(
      ENDPOINTS.auth.signin,
      paramsArr || [],
      { username, password },
      headerOptions,
    );
  }

  me(paramsArr?: any[]): Observable<any> {
    return this.endpointService
      .fetchEndpoint(ENDPOINTS.user.user, paramsArr || [])
      .pipe(
        map((res) => res['data']),
        tap((res) => this.user$.next(res)),
      );
  }

  getUser(): Observable<any | null> {
    return this.user$.asObservable();
  }
}
