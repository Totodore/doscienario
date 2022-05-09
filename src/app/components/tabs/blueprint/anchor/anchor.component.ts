import { Relationship } from './../../../../models/api/blueprint.model';
import { Component, Input, OnInit } from '@angular/core';
import { Node } from 'src/app/models/api/blueprint.model';

@Component({
  selector: 'g[anchor]',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss']
})
export class AnchorComponent {

  @Input()
  public parentNode: Node;

  @Input()
  public childNode: Node;

  @Input()
  public data: Relationship;

  @Input()
  public overlay: HTMLDivElement;

  constructor() { }

  public get x(): number {
    return this.parentNode.x + this.parentNode.bounds.width + this.overlay.clientWidth / 2;
  }

  public get y(): number {
    return this.parentNode.y + this.overlay.clientHeight / 2;
  }

  public get color(): string {
    return '#' + (this.parentNode.color || "FFF");
  }
}
