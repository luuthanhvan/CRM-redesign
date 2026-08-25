import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';

import { CommonValidator } from '~core/validators/common.validator';
import { UserValidator } from '~core/validators/user.validator';

import { USER_ICONS, USER_ID } from '~features/user/user.constant';
import { User } from '~features/user/user.interface';
import { UserApi } from '~features/user/user.api';

import { SharedModule } from '~shared/modules/shared.module';
import { CommonService } from '~shared/services/common.service';
import { ToastService } from '~shared/services/toast.service';

@Component({
  selector: 'app-user-form',
  imports: [SharedModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private userApi = inject(UserApi);
  protected commonService = inject(CommonService);
  protected data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<UserFormComponent>);

  togglePassword = signal(true);
  toggleConfirmPassword = signal(true);

  USER_ID = USER_ID;
  icon = USER_ICONS;
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        CommonValidator.noSpecialCharactersValidator,
      ]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        UserValidator.mustMatch('password'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      isAdmin: new FormControl(false),
      isActive: new FormControl(false),
    });
    if (this.data && this.data.action === 'edit') {
      // remove required validator from password and confirm password fields
      this.userForm.controls['password'].removeValidators(Validators.required);
      this.userForm.controls['password'].updateValueAndValidity();
      this.userForm.controls['confirmPassword'].removeValidators(
        Validators.required,
      );
      this.userForm.controls['confirmPassword'].updateValueAndValidity();
      this.getUserById();
    }
  }

  getUserById() {
    this.userApi.getUser(this.data.userId).subscribe((data) => {
      data && this.setFormData(data);
    });
  }

  setFormData(data: User) {
    this.userForm.controls['name'].setValue(data['name'] || '');
    this.userForm.controls['username'].setValue(data['username'] || '');
    this.userForm.controls['email'].setValue(data['email'] || '');
    this.userForm.controls['phone'].setValue(data['phone'] || '');
    this.userForm.controls['isAdmin'].setValue(data['isAdmin'] || false);
    this.userForm.controls['isActive'].setValue(data['isActive'] || false);
  }

  onSubmit() {
    if (this.data.action === 'add') {
      this.userApi
        .createUser(this.userForm.value)
        .pipe(
          tap((response) => {
            if (response.isSuccess()) {
              this.toastService.showSuccessMessage(
                'Add new User successfully!',
                this.USER_ID.TOAST_ADD_SUCCESS,
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Add new User failed!',
                this.USER_ID.TOAST_ADD_FAILED,
              );
            }
          }),
        )
        .subscribe();
    } else {
      this.userApi
        .updateUser(this.data.userId, this.userForm.value)
        .pipe(
          tap((response) => {
            if (response.isSuccess()) {
              this.toastService.showSuccessMessage(
                'Update the User successfully!',
                this.USER_ID.TOAST_UPDATE_SUCCESS,
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Update the User failed!',
                this.USER_ID.TOAST_UPDATE_FAILED,
              );
            }
          }),
        )
        .subscribe();
    }
  }
}
