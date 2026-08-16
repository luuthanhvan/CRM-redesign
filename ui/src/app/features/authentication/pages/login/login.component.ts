import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ToastService } from '~shared/services/toast.service';

import { AUTH_ID } from '~features/authentication/auth.constant';
import { AuthService } from '~features/authentication/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastService = inject(ToastService);

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
    this.authService.login(username, password).subscribe({
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
