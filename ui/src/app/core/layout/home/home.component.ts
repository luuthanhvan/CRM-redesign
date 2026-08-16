import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAddressBook,
  faCreditCard,
  faGauge,
  faGear,
  faListCheck,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

import { ProgressSpinnerComponent } from '~shared/components/progress-spinner/progress-spinner.component';

import { AuthService } from '~features/authentication/auth.service';
import { HOME_ID } from '~core/layout/home/home.constant';
import { User } from '~features/user/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButton,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    ProgressSpinnerComponent,
    RouterModule,
    RouterOutlet,
    TranslateModule,
  ],
})
export class HomeComponent implements OnInit {
  HOME_ID = HOME_ID;
  icon = {
    faAddressBook,
    faCreditCard,
    faGauge,
    faGear,
    faListCheck,
    faUsers,
  };
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
