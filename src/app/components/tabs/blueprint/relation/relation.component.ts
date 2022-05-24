import { TemporaryNode } from './../blueprint.component';
import { Vector } from 'src/types/global';
import { Component, Input } from '@angular/core';
import { Node, Relationship } from 'src/app/models/api/blueprint.model';

@Component({
  selector: 'g[relation]',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss']
})
export class RelationComponent {

  @Input()
  public data: Relationship | TemporaryNode;

  @Input()
  public parentNode: Node;

  @Input()
  public childNode: Node;

  @Input()
  public overlay: HTMLDivElement;

  public get d(): string {
    let o: Vector, e: Vector;
    if (this.data instanceof Relationship) {
      o = this.data.getOrigin(this.parentNode.bounds);
      e = this.data.getDestination(this.childNode.bounds);
    } else {
      o = [this.data.ox, this.data.oy];
      e = [this.data.ex, this.data.ey];
    }
    const w = -(o[0] - e[0]);
    const half = this.overlay.clientHeight / 2;
    const [ox, oy, ex, ey] = [o[0] + half, o[1] + half, e[0] + half, e[1] + half];
    return `M${ox},${oy} C${ox + w / 2},${oy} ${ox + w / 2},${ey} ${ex},${ey}`;
  }

}
