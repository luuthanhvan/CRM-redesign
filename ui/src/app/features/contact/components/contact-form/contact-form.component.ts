import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs/operators';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CommonValidator } from '~core/validators/common.validator';

import {
  CONTACT_ID,
  CONTACT_ICONS,
  CONTACT_LEAD_SOURCES,
  CONTACT_SALUTATIONS,
} from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactApi } from '~features/contact/contact.api';

import { User } from '~features/user/user.interface';
import { UserApi } from '~features/user/user.api';

import { SharedModule } from '~shared/modules/shared.module';
import { ToastService } from '~shared/services/toast.service';

@Component({
  selector: 'app-contact-form',
  imports: [SharedModule],
  providers: [],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  private contactApi = inject(ContactApi);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private userApi = inject(UserApi);
  protected data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ContactFormComponent>);

  CONTACT_ID = CONTACT_ID;
  salutations = CONTACT_SALUTATIONS;
  leadSources = CONTACT_LEAD_SOURCES;
  icon = CONTACT_ICONS;

  contactForm!: FormGroup;
  assignedToUsers: User[] = [];
  // retain created time when editing Sales order
  createdTime = new Date();

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      contactName: new FormControl('', [
        Validators.required,
        CommonValidator.noSpecialCharactersValidator,
      ]),
      salutation: new FormControl('', [Validators.required]),
      mobilePhone: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      email: new FormControl('', [Validators.email]),
      organization: new FormControl(''),
      dob: new FormControl(''),
      leadSrc: new FormControl('', [Validators.required]),
      assignedTo: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      description: new FormControl(''),
    });

    this.userApi.getListOfUserNames().subscribe((data) => {
      this.assignedToUsers = data || [];
    });

    if (this.data && this.data.action === 'edit') {
      this.getContactById();
    }
  }

  getContactById() {
    this.contactApi.getContact(this.data.contactId).subscribe((data) => {
      data && this.setFormData(data);
    });
  }

  setFormData(data: Contact) {
    this.contactForm.controls['contactName'].setValue(
      data['contactName'] || '',
    );
    this.contactForm.controls['salutation'].setValue(data['salutation'] || '');
    this.contactForm.controls['mobilePhone'].setValue(
      data['mobilePhone'] || '',
    );
    this.contactForm.controls['email'].setValue(data['email'] || '');
    this.contactForm.controls['organization'].setValue(
      data['organization'] || '',
    );
    this.contactForm.controls['dob'].setValue(data['dob'] || '');
    this.contactForm.controls['leadSrc'].setValue(data['leadSrc'] || '');
    this.contactForm.controls['assignedTo'].setValue(data['assignedTo'] || '');
    this.contactForm.controls['address'].setValue(data['address'] || '');
    this.contactForm.controls['description'].setValue(
      data['description'] || '',
    );
    this.createdTime = data['createdTime'] || new Date();
  }

  onSubmit() {
    const currentUserInfo = window.localStorage.getItem('currentUser');
    const contactInfo: Contact = {
      contactName: this.contactForm.controls['contactName'].value,
      salutation: this.contactForm.controls['salutation'].value,
      mobilePhone: this.contactForm.controls['mobilePhone'].value,
      email: this.contactForm.controls['email'].value,
      organization: this.contactForm.controls['organization'].value,
      dob: this.contactForm.controls['dob'].value,
      leadSrc: this.contactForm.controls['leadSrc'].value,
      assignedTo: this.contactForm.controls['assignedTo'].value,
      address: this.contactForm.controls['address'].value,
      description: this.contactForm.controls['description'].value,
      creator: currentUserInfo && (JSON.parse(currentUserInfo).name || ''),
      createdTime:
        this.data && this.data.action === 'add' ? new Date() : this.createdTime,
      updatedTime: new Date(),
    };
    if (this.data.action === 'add') {
      this.contactApi
        .addContact(contactInfo)
        .pipe(
          tap((response) => {
            if (response.isSuccess()) {
              this.toastService.showSuccessMessage(
                'Add new Contact!',
                this.CONTACT_ID.TOAST_ADD_SUCCESS,
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Add new Contact!',
                this.CONTACT_ID.TOAST_ADD_FAILED,
              );
            }
          }),
        )
        .subscribe();
    } else {
      this.contactApi
        .updateContact(this.data.contactId, contactInfo)
        .pipe(
          tap((response) => {
            if (response.isSuccess()) {
              this.toastService.showSuccessMessage(
                'Update the Contact!',
                this.CONTACT_ID.TOAST_UPDATE_SUCCESS,
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Update the Contact!',
                this.CONTACT_ID.TOAST_UPDATE_FAILED,
              );
            }
          }),
        )
        .subscribe();
    }
  }

  onCancel() {
    // Close the dialog and pass the data packet back
    this.dialogRef.close('cancel');
  }
}
