import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
})
export class CreateProjectComponent {

  @Output() public onConfirm: EventEmitter<string> = new EventEmitter();
}
