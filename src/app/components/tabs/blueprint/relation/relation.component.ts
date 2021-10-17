import { AfterViewChecked, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Relationship } from 'src/app/models/api/blueprint.model';
import { TemporaryNode } from '../blueprint.component';

@Component({
  selector: 'g[relation]',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss']
})
export class RelationComponent implements AfterViewChecked {

  @Input()
  public data: Relationship | TemporaryNode;

  @Input()
  public overlay: HTMLDivElement;

  public initialized = false;

  public ngAfterViewChecked(): void {
    if (!this.initialized && this.overlay)
      this.initialized = true;
  }

  public get d(): string {
    const w = -(this.data.ox - this.data.ex);
    const half = this.overlay.clientHeight / 2;
    const [ox, oy, ex, ey] = [this.data.ox + half, this.data.oy + half, this.data.ex + half, this.data.ey + half];
    return `M${ox},${oy} C${ox + w / 2},${oy} ${ox + w / 2},${ey} ${ex},${ey}`;
  }

}
