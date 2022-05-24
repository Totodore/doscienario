import { NGXLogger } from 'ngx-logger';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { TabService } from 'src/app/services/tab.service';
import { ContextMenuService } from './../../../../services/ui/context-menu.service';
import { BlueprintComponent } from 'src/app/components/tabs/blueprint/blueprint.component';
import { Relationship } from './../../../../models/api/blueprint.model';
import { Component, Input, OnInit, HostListener, ElementRef } from '@angular/core';
import { Node } from 'src/app/models/api/blueprint.model';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { ColorNodeOut, RemoveRelOut } from 'src/app/models/sockets/out/blueprint.out';
import { findParentRels } from 'src/app/utils/tree.utils';

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

  @Input()
  public blueprintRef: BlueprintComponent;

  constructor(
    private readonly contextMenu: ContextMenuService,
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    private readonly socket: SocketService,
    private readonly logger: NGXLogger
  ) { }

  @HostListener("click")
  public onClick() {
    const childNodeWrapper = this.blueprintRef.getNodeEl(this.childNode.id).wrapper.nativeElement;
    if (childNodeWrapper.classList.contains("flash-animated")) {
      // Reflow hack to restart animation https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
      childNodeWrapper.style.animation = "none";
      childNodeWrapper.offsetHeight;
      childNodeWrapper.style.animation = null;
    } else
      childNodeWrapper.classList.add("flash-animated");
  }

  @HostListener("contextmenu", ["$event"])
  public onRightClick(e: MouseEvent) {
    this.contextMenu.show(e, [
      {
        icon: "delete",
        color: "red",
        label: "Supprimer",
        action: () => this.remove()
      }
    ]);
  }

  public remove() {
    this.logger.log("Removing relationship", this.data.id);
    this.blueprint.loopbackRelsMap.delete(this.data.id);
    if (findParentRels(this.childNode, this.blueprint.loopbackRelsArr).length == 0) {
      this.childNode.color = null;
      this.socket.emit(Flags.COLOR_NODE, new ColorNodeOut(this.blueprint.id, this.childNode.id, null));
    }
    this.socket.emit(Flags.REMOVE_RELATION, new RemoveRelOut(this.data.id, this.blueprint.id));
  }

  public get x(): number {
    return this.parentNode.x + this.parentNode.bounds.width + this.overlay.clientWidth / 2;
  }

  public get y(): number {
    return this.parentNode.y + this.overlay.clientHeight / 2;
  }

  public get color(): string {
    return '#' + (this.childNode.color || "FFF");
  }

  public get blueprint() {
    return this.project.getBlueprint(this.tabs.displayedTab[1].id);
  }
}
