import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-sheet',
  templateUrl: './add-sheet.component.html',
  styleUrls: ['./add-sheet.component.scss']
})
export class AddSheetComponent {

  @Input()
  public position: DOMRect;

  public get top() {
    return this.position.top - 48 - this.position.height - 20;
  }

  public get left() {
    return this.position.left + this.position.width  / 2;
  }
}
