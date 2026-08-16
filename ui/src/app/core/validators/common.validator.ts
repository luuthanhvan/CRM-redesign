import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CommonValidator {
  static noSpecialCharactersValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const forbidden = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      control.value
    );
    return !forbidden ? null : { noSpecialCharacters: true };
  }
}
