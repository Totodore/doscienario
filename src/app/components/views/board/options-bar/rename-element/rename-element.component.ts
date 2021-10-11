import { Color } from '@angular-material-components/color-picker';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rename-element',
  templateUrl: './rename-element.component.html',
  styleUrls: ['./rename-element.component.scss']
})
export class RenameElementComponent implements OnInit {

  @Input()
  public title: string;

  @Output()
  public readonly titleChange = new EventEmitter<string>();

  @Input()
  public color?: string;

  public colorObject: Color;

  @Output()
  public readonly colorChange = new EventEmitter<string>();

  constructor() { }

  public ngOnInit(): void {
    if (this.color) {
      const hex = this.color;
      const [r, g, b] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(el => parseInt(el, 16));
      this.colorObject = new Color(r, g, b);
    } else this.colorObject = new Color(245, 245, 245);
  }

  public onColorObjectChange(obj: Color) {
    this.color = obj?.toHexString(false)?.substring(1);
    this.colorChange.emit(this.color);
  }

}
