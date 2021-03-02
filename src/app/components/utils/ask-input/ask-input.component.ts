import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';

@Component({
  selector: 'app-ask-input',
  templateUrl: './ask-input.component.html',
})
export class AskInputComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public title: string
  ) {}


  @Output() public onConfirm: EventEmitter<string> = new EventEmitter();
}
