import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import { HOME_ICONS, HOME_ID } from '~core/layout/home/home.constant';

import { AuthApi } from '~features/authentication/auth.api';
import { AuthService } from '~features/authentication/auth.service';
import { PasswordFormComponent } from '~features/authentication/components/password-form/password-form.component';
import { User } from '~features/user/user.interface';

import { ProgressSpinnerComponent } from '~shared/components/progress-spinner/progress-spinner.component';
import { SharedModule } from '~shared/modules/shared.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [ProgressSpinnerComponent, SharedModule],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  protected translate = inject(TranslateService);
  protected authApi = inject(AuthApi);
  protected authService = inject(AuthService);
  readonly dialog = inject(MatDialog);

  HOME_ID = HOME_ID;
  icon = HOME_ICONS;
  currentUser!: User;
  isBrowserRefresh: boolean = false;
  isAdminUser: boolean = false;

  constructor() {
    // Set included languages
    this.translate.addLangs(['en', 'vi']);
    const browserLang = navigator.languages
      ? navigator.languages[0].split('-')[0]
      : navigator.language.split('-')[0];

    // Get the current browser language, if included set it
    const defaultLang = this.translate.getLangs().includes(browserLang)
      ? browserLang
      : 'en';

    // Set the default and current language
    this.translate.setDefaultLang(defaultLang);
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authApi.me().subscribe((data) => {
        this.currentUser = data;
        this.isAdminUser = this.currentUser.isAdmin;
        window.localStorage.setItem(
          'currentUser',
          JSON.stringify(this.currentUser),
        );
        if (this.isAdminUser) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.router.navigateByUrl('/contact');
        }
      });
    }
  }

  openChangePwdDialog() {
    const dialogRef = this.dialog.open(PasswordFormComponent, {
      disableClose: true,
      width: '600px',
      maxWidth: '600px',
      minWidth: '400px',
      data: {
        userId: this.currentUser._id,
      },
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  // check the current URL contains the target route
  isRouteActive(urlKeyword: string): boolean {
    return this.router.url.includes(urlKeyword);
  }
}
