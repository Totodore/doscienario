import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ask-textarea',
  templateUrl: './ask-textarea.component.html'
})
export class AskTextareaComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, label?: string }
  ) {}


  @Output() public onConfirm: EventEmitter<string> = new EventEmitter();

}
