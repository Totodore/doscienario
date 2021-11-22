import { Color } from '@angular-material-components/color-picker';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rename-element',
  templateUrl: './rename-element.component.html',
  styleUrls: ['./rename-element.component.scss']
})
export class RenameElementComponent {

  public colorObject: Color;

  @Input()
  public title: string;

  @Output()
  public readonly titleChange = new EventEmitter<string>();


  @Output()
  public readonly colorChange = new EventEmitter<string>();

  private _color: string;

  public onColorObjectChange(obj: Color) {
    this.color = obj?.toHexString(false)?.substring(1);
    this.colorChange.emit(this.color);
  }

  
  @Input()
  public set color(val: string | undefined) {
    this._color = val || "FFFFFF";
    if (val) {
      const hex = val;
      const [r, g, b] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(el => parseInt(el, 16));
      this.colorObject = new Color(r, g, b);
    } else this.colorObject = new Color(245, 245, 245);
  }

  public get color(): string | undefined {
    return this._color;
  }

}
