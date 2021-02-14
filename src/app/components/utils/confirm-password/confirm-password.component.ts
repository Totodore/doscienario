import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
})
export class ConfirmPasswordComponent {

  @Output() public onConfirm: EventEmitter<string> = new EventEmitter();
}
