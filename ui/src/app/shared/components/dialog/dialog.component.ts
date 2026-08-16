import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  inject,
  EventEmitter,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<DialogComponent>);

  @Input('title') title: string = 'Warning from Spidey!';
  @Input('confirmBtnLabel') confirmBtnLabel: string = 'Yes, Delete it!';
  @Input('cancelBtnLabel') cancelBtnLabel: string = 'No, Keep it.';
  @Input('content') content: string =
    'This action will delete all saved data. Are you sure?';

  @Output() sendingSubmitSignal = new EventEmitter<any>();

  ngOnInit(): void {}

  onConfirm() {
    this.sendingSubmitSignal.emit(true);
  }

  onClose() {
    this.sendingSubmitSignal.emit(false);
    this.dialogRef.close();
  }
}
