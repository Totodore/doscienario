import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-resizable-bar',
  templateUrl: './resizable-bar.component.html',
  styleUrls: ['./resizable-bar.component.scss']
})
export class ResizableBarComponent {


  @Output()
  public readonly toggle = new EventEmitter<boolean>();

  @Input()
  public readonly name?: string;
}
