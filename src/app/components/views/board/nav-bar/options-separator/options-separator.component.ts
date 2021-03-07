import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-options-separator',
  templateUrl: './options-separator.component.html',
  styleUrls: ['./options-separator.component.scss']
})
export class OptionsSeparatorComponent {

  public displayed = true;

  @Input() public title?: string;

  @Output() private toggle: EventEmitter<void> = new EventEmitter;

  public onToggle() {
    this.displayed = !this.displayed;
    this.toggle.emit();
  }
}
