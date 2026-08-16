import {
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import type { Observable } from 'rxjs';
import { AuthService } from '~features/authentication/auth.service';
import { LoadingService } from '~shared/services/loading.service';

export function authenticationInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  if (!req.headers.get('skipLoading')) {
    loadingService.showLoading();
  }

  if (req.headers.get('NoAuth')) {
    return next(req.clone());
  } else {
    const clonedreq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + authService.getToken()
      ),
    });
    return next(clonedreq).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do something
          }
        },
        error: (err) => {
          if (err.error.auth == false) {
            router.navigateByUrl('/login');
          }
        },
      }),
      finalize(() => {
        if (!req.headers.get('skipLoading')) {
          loadingService.hideLoading();
        }
      })
    );
  }
}
