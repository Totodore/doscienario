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

  public context: CanvasRenderingContext2D;

  public tabId: string;
  public show: boolean;

  public readonly type: TabTypes.BLUEPRINT;
  public readonly paddingLeft = 48;
  public readonly enableSkeleton = false;

  public drawState: DrawStates = "none";
  public drawingOriginPos: Tuple;

  public ghostNode: Tuple;
  public ghostSize: Tuple;
  public mousePos: Tuple;
  public scrollIntervalId: number;
  public tresholdMousePole: Poles[];

  constructor(
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly progress: ProgressService
  ) { }

  ngAfterViewChecked() {
    if (this.canvas && !this.context) {
      this.context = this.canvas.nativeElement.getContext("2d");
      this.canvas.nativeElement.width = this.wrapper.nativeElement.clientWidth * 2;
      this.canvas.nativeElement.height = this.wrapper.nativeElement.clientHeight * 2;
      this.canvas.nativeElement.style.width = this.canvas.nativeElement.width + "px";
      this.canvas.nativeElement.style.height = this.canvas.nativeElement.height + "px";
      this.overlay.nativeElement.style.width = this.canvas.nativeElement.width + "px";
      this.overlay.nativeElement.style.height = this.canvas.nativeElement.height + "px";
      this.wrapper.nativeElement.addEventListener("scroll", (e) => this.onScroll(e));
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

  @HostListener("mousemove", ["$event"])
  onMouseMove(e: MouseEvent) {
    if (this.drawState === "drawing") {
      this.mousePos = [e.x, e.y];
      const currTreshold = this.tresholdMouse([e.clientX, e.clientY]);
      if (!this.tresholdMousePole?.equals(currTreshold) && this.scrollIntervalId) {
        window.clearInterval(this.scrollIntervalId);
        this.tresholdMousePole = currTreshold;
        this.scrollIntervalId = null;
      }
      if (currTreshold.length > 0 && !this.scrollIntervalId) {
        this.scrollIntervalId = window.setInterval(() => this.adaptViewport(currTreshold), 16.6);   //60fps
        this.tresholdMousePole = currTreshold;
      }

      this.drawGhostNodeAndRel([e.x, e.y]);
    }
  }

  onScroll(e: Event) {
    if (this.drawState === "drawing") {
      // if (this.tresholdMouse([e.clientX, e.clientY]))
      //   this.scrollIntervalId = window.setInterval(() => this.widenViewportIfNeeded([e.clientX, e.clientY]), 200);
      // else if (this.scrollIntervalId) {
      //   window.clearInterval(this.scrollIntervalId);
      //   this.scrollIntervalId = null;
      // }
      this.drawGhostNodeAndRel(this.mousePos);
    }
  }


  drawGhostNodeAndRel(pos: Tuple) {
    let [ox, oy] = this.drawingOriginPos;
    let [ex, ey] = [pos[0], pos[1] - 48];
    ex += this.wrapper.nativeElement.scrollLeft;
    ey += this.wrapper.nativeElement.scrollTop;
    ex = Math.min(ex, this.canvas.nativeElement.width - this.ghostSize[0]);
    ey = Math.min(ey, this.canvas.nativeElement.height - this.ghostSize[1]);
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

    this.ghostNode = [ex, ey];
  }

  adaptViewport(treshold: Poles[]) {
    if (treshold.includes("north")) {
      // if (this.wrapper.nativeElement.scrollTop === 0)
          // this.updateViewPortSize([0, 10]);
      this.wrapper.nativeElement.scrollTop -= 10;
    } if (treshold.includes("south")) {
      if (this.wrapper.nativeElement.isMaxScrollTop)
        this.updateViewPortSize([0, 10]);
      this.wrapper.nativeElement.scrollTop += 10;
    } if (treshold.includes("east")) {
      if (this.wrapper.nativeElement.isMaxScrollLeft)
        this.updateViewPortSize([10, 0]);
      this.wrapper.nativeElement.scrollLeft += 10;
    } if (treshold.includes("west"))
      this.wrapper.nativeElement.scrollLeft -= 10;
  }

  private tresholdMouse(pos: Tuple): Poles[] {
    const treshold = 48;
    const poles: Poles[] = [];
    if (pos[1] - 48 < treshold)
      poles.push("north");
    if (pos[1] > window.innerHeight - treshold)
      poles.push("south");
    if (pos[0] > this.wrapper.nativeElement.clientWidth - treshold)
      poles.push("east");
    if (pos[0] < treshold)
      poles.push("west");
    return poles;
  }
  private updateViewPortSize(size: Tuple) {
    this.canvas.nativeElement.width += size[0];
    this.canvas.nativeElement.height += size[1];
    this.canvas.nativeElement.style.width = this.canvas.nativeElement.width + "px";
    this.canvas.nativeElement.style.height = this.canvas.nativeElement.height + "px";
    this.overlay.nativeElement.style.width = this.canvas.nativeElement.width + "px";
    this.overlay.nativeElement.style.height = this.canvas.nativeElement.height + "px";
  }

  drawSkeleton(o: Tuple, s: Tuple, p: [number, number, number, number]) {
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
      this.ghostNode = null;
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

  beginRelation(parent: NodeComponent, e: [number, number]) {
    e[0] += this.wrapper.nativeElement.scrollLeft;
    e[1] += this.wrapper.nativeElement.scrollTop;
    this.drawState = "drawing";
    this.ghostSize = [parent.wrapper.nativeElement.clientWidth, parent.wrapper.nativeElement.clientHeight];
    this.drawingOriginPos = e;
    this.ghostNode = e;
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
type DrawStates = "drawing" | "none";
type Tuple = [number, number];
