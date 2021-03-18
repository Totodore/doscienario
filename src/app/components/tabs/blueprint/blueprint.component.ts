import { ProgressService } from './../../../services/progress.service';
import { SocketService } from './../../../services/socket.service';
import { Blueprint, Node } from './../../../models/sockets/blueprint-sock.model';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { ProjectService } from './../../../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Provider, Type, ViewEncapsulation, AfterViewInit, AfterViewChecked, HostListener } from '@angular/core';
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
  public readonly enableSkeleton = false;

  public drawState: DrawStates = "none";
  public drawingOriginPos: [number, number];


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

  @HostListener("mousemove", ["$event"])
  onMouseMove(e: MouseEvent) {
    if (this.drawState === "drawing") {
      let [ox, oy] = this.drawingOriginPos;
      let [ex, ey] = [e.x, e.y - 48];
      oy -= 48;
      const [w, h] = [-(ox - ex), oy - ey];
      const [p1x, p1y, p2x, p2y] = [ox + w / 2, oy, ox + w / 2, ey];
      this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.context.strokeStyle = "#b0bec5";
      this.context.beginPath();
      this.context.moveTo(ox, oy);
      this.context.bezierCurveTo(p1x, p1y, p2x, p2y, ex, ey);
      this.context.stroke();
      this.context.closePath();
      this.drawSkeleton([ox, oy], [w, h], [p1x, p1y, p2x, p2y]);
    }
  }

  drawSkeleton(o: [number, number], s: [number, number], p: [number, number, number, number]) {
    if (!this.enableSkeleton)
      return;
    this.context.beginPath();
    this.context.arc(p[0], p[1], 5, 0, 2 * Math.PI);  // Control point one
    this.context.fillStyle = "red";
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.arc(p[2], p[3], 5, 0, 2 * Math.PI);  // Control point two
    this.context.fillStyle = "blue";
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.strokeStyle = "yellow";
    this.context.moveTo(o[0], o[1]);
    this.context.lineTo(o[0] + s[0] / 2, o[1]);
    this.context.moveTo(o[0] + s[0] / 2, o[1]);
    this.context.lineTo(o[0] + s[0] / 2, o[1] - s[1]);
    this.context.moveTo(o[0] + s[0] / 2, o[1] - s[1]);
    this.context.lineTo(o[0] + s[0], o[1] - s[1]);
    this.context.stroke();
    this.context.closePath();
  }

  @HostListener("click", ["$event"])
  onMouseClick(e: Event) {
    if (this.drawState === "drawing") {
      e.preventDefault();
      this.drawState = "none";
    }
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

  getAbsTop(relY: number): number {
    return relY + this.wrapper?.nativeElement?.getBoundingClientRect()?.height / 2;
  }
  getAbsLeft(relX: number): number {
    return relX + this.paddingLeft;
  }

  beginRelation(parent: Node, e: [number, number]) {
    this.drawState = "drawing";
    this.drawingOriginPos = e;
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
export type DrawStates = "drawing" | "none";
