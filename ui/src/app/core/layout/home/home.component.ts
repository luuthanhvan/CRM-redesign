import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '~features/authentication/auth.service';
import { HOME_ICONS, HOME_ID } from '~core/layout/home/home.constant';
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
  HOME_ID = HOME_ID;
  icon = HOME_ICONS;
  currentUser!: User;
  isBrowserRefresh: boolean = false;
  isAdminUser: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
  ) {
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
      this.authService.me().subscribe((data) => {
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

  openChangePwdDialog() {}

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  signout() {
    this.authService.removeToken();
    window.localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  // check the current URL contains the target route
  isRouteActive(urlKeyword: string): boolean {
    return this.router.url.includes(urlKeyword);
  }
}
