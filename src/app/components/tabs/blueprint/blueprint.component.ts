import { BlueprintService } from './../../../services/blueprint.service';
import { ProgressService } from './../../../services/progress.service';
import { SocketService } from './../../../services/socket.service';
import { Blueprint, Node } from './../../../models/sockets/blueprint-sock.model';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { ProjectService } from './../../../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Provider, Type, ViewEncapsulation, AfterViewInit, AfterViewChecked, HostListener } from '@angular/core';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';
import { v4 as uuid4 } from "uuid";
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Poles, NodeComponent } from './node/node.component';


@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent implements ITabElement, AfterViewChecked {

  @ViewChild("viewport", { static: false })
  public canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild("wrapper", { static: false })
  public wrapper: ElementRef<HTMLDivElement>;

  @ViewChild("overlay", { static: false })
  public overlay: ElementRef<HTMLDListElement>;

  public initialized = false;
  public tabId: string;
  public show: boolean;

  public readonly type: TabTypes.BLUEPRINT;
  private readonly paddingLeft = 48;

  constructor(
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly progress: ProgressService,
    public readonly blueprintHandler: BlueprintService
  ) { }

  ngAfterViewChecked() {
    if (this.canvas && !this.initialized) {
      this.blueprintHandler.init(this.canvas.nativeElement, this.wrapper.nativeElement, this.overlay.nativeElement);
      this.initialized = true;
    }
  }

  openTab(id?: string | number): string {
    this.tabId = uuid4();
    this.progress.show();
    this.socket.socket.emit(Flags.OPEN_BLUEPRINT, [this.tabId, id]);
    return this.tabId;
  }

  loadedTab() {
    this.progress.hide();
  }


  onDragNode(e: CdkDragMove<CdkDrag>) {
    const draggedNode = e.source.element.nativeElement;
  }

  getAbsTop(relY: number): number {
    return relY + this.wrapper?.nativeElement?.getBoundingClientRect()?.height / 2;
  }
  getAbsLeft(relX: number): number {
    return relX + this.paddingLeft;
  }

  beginRelation(parent: NodeComponent, e: [number, number]) {
    this.blueprintHandler.beginGhostRelation(parent, e);
  }

  get blueprint(): Blueprint {
    return this.project.openBlueprints[this.tabId];
  }
  get root(): Node {
    return this.blueprint.nodes.find(el => el.isRoot);
  }
  get nodes(): Node[] {
    return this.blueprint.nodes.filter(el => !el.isRoot);
  }

  get title(): string {
    if (this.blueprint == null)
      return "Chargement...";
    else if (this.blueprint.name?.length == 0)
      return "Nouvel arbre";
    else return this.blueprint.name;
  }

  get id(): number {
    return this.blueprint?.id;
  }

}
