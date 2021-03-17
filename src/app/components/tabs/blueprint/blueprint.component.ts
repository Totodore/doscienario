import { ProgressService } from './../../../services/progress.service';
import { SocketService } from './../../../services/socket.service';
import { Blueprint, Node } from './../../../models/sockets/blueprint-sock.model';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { ProjectService } from './../../../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Provider, Type, ViewEncapsulation, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';
import { v4 as uuid4 } from "uuid";
import { Flags } from 'src/app/models/sockets/flags.enum';


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

  public context: CanvasRenderingContext2D;

  public tabId: string;
  public show: boolean;


  public readonly type: TabTypes.BLUEPRINT;
  public readonly paddingLeft = 40;

  constructor(
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly progress: ProgressService
  ) { }

  ngAfterViewChecked() {
    this.context ??= this.canvas?.nativeElement?.getContext("2d");
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

  drawCanvas() {
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 2;
    this.context.beginPath();
    // this.context.moveTo()
  }

  getAbsY(relY: number): number {
    return relY + this.wrapper?.nativeElement?.clientHeight / 2;
  }
  getAbsX(relX: number): number {
    return relX + this.paddingLeft;
  }

  beginRelation(parent: Node) {

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
