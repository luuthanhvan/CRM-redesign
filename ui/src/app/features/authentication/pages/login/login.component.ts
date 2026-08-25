import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AUTH_ID } from '~features/authentication/auth.constant';
import { AuthApi } from '~features/authentication/auth.api';
import { AuthService } from '~features/authentication/auth.service';

import { SharedModule } from '~shared/modules/shared.module';
import { CommonService } from '~shared/services/common.service';
import { ToastService } from '~shared/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private authApi = inject(AuthApi);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected commonService = inject(CommonService);

  togglePassword = signal(true);

  AUTH_ID = AUTH_ID;
  errorMessage: string = '';
  loginForm!: FormGroup;
  submitted: boolean = false;

  ngOnInit(): void {
    this.initData();
  }

  private initData() {
    // initialize login form including username and password
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // if an user is not logged in, then navigate to the root page
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    const { username, password } = form.value;
    this.authApi.login(username, password).subscribe({
      next: (res) => {
        this.authService.setToken(res['data']);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.toastService.showErrorMessage(err.error['message']);
      },
    });
  }
}
