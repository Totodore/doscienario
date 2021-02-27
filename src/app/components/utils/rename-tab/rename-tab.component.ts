import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rename-tab',
  templateUrl: './rename-tab.component.html',
})
export class RenameTabComponent {

  @Output() public onConfirm: EventEmitter<string> = new EventEmitter();

}
