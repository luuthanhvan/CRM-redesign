import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { faKey } from '@fortawesome/free-solid-svg-icons';

import { UserValidator } from '~core/validators/user.validator';

import { AUTH_ID } from '~features/authentication/auth.constant';
import { AuthService } from '~features/authentication/auth.service';
import { UserApi } from '~features/user/user.api';

import { SharedModule } from '~shared/modules/shared.module';
import { CommonService } from '~shared/services/common.service';
import { ToastService } from '~shared/services/toast.service';

@Component({
  selector: 'app-password-form',
  imports: [SharedModule],
  providers: [],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss',
})
export class PasswordFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private userApi = inject(UserApi);
  private authService = inject(AuthService);
  protected commonService = inject(CommonService);
  protected data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PasswordFormComponent>);

  togglePassword = signal(true);
  toggleConfirmPassword = signal(true);

  AUTH_ID = AUTH_ID;
  icon = { faKey };
  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        UserValidator.mustMatch('password'),
      ]),
    });
  }

  onSubmit() {
    this.userApi
      .changeUserPassword(
        this.data.userId,
        this.passwordForm.controls['password'].value,
      )
      .pipe(
        tap((response) => {
          if (response.isSuccess()) {
            this.toastService.showSuccessMessage(
              'Update password successfully!',
              this.AUTH_ID.TOAST_UPDATE_PASSWORD_SUCCESS,
            );
            this.dialogRef.close();
            this.authService.signout();
          } else {
            this.toastService.showErrorMessage(
              'Add new User failed!',
              this.AUTH_ID.TOAST_UPDATE_PASSWORD_FAILED,
            );
          }
        }),
      )
      .subscribe();
  }
}
