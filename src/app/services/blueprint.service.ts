import { ProgressService } from './progress.service';
import { SnackbarService } from './snackbar.service';
import { WorkerManager, WorkerType } from './../utils/worker-manager.utils';
import { Vector } from './../../types/global.d';
import { BlueprintComponent } from './../components/tabs/blueprint/blueprint.component';
import { CreateNodeRes, Relationship, Blueprint, PlaceNodeOut } from './../models/sockets/blueprint-sock.model';
import { Flags } from './../models/sockets/flags.enum';
import { SocketService } from './socket.service';
import { ProjectService } from './project.service';
import { Injectable } from '@angular/core';
import { NodeComponent, Poles } from '../components/tabs/blueprint/node/node.component';
import { Node } from "../models/sockets/blueprint-sock.model";
import { findLevelByNode } from '../utils/tree.utils';
@Injectable({
  providedIn: 'root'
})
export class BlueprintService {

  private context: CanvasRenderingContext2D;

  private readonly enableSkeleton = false;

  public drawState: DrawStates = "none";
  private drawingOriginPos: Tuple;

  private ghostSize: Tuple;
  private mousePos: Tuple;
  private scrollIntervalId: number;
  private tresholdMousePole: Poles[];
  public parentGhost: NodeComponent;

  private draggedNode: NodeComponent;
  private draggedRelationships: Relationship[];

  private canvas: HTMLCanvasElement;
  private wrapper: HTMLElement;
  private overlay: HTMLElement;
  private tabId: string;
  private docId: number;
  private component: BlueprintComponent;
  private blueprintWorker: WorkerManager;

  public ghostNode: Tuple;
  public scrollPoles: Set<Poles> = new Set();

  constructor(
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly snack: SnackbarService,
    private readonly progress: ProgressService
  ) {
    this.blueprintWorker = new WorkerManager(WorkerType.Blueprint);
  }

  public init(component: BlueprintComponent) {
    this.component = component;
    this.tabId = component.tabId;
    this.canvas = component.canvas.nativeElement;
    this.wrapper = component.wrapper.nativeElement;
    this.overlay = component.overlay.nativeElement;
    this.docId = component.id;
    this.configSize();
    this.onScroll();
    this.wrapper.addEventListener("scroll", () => this.onScroll());
    this.wrapper.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.wrapper.addEventListener("click", (e) => this.onClick(e));
    this.wrapper.addEventListener("resize", () => this.configSize());
    this.drawRelations();
  }

  private configSize() {
    const [w, h] = [
      Math.max(this.wrapper.clientWidth, this.project.openBlueprints[this.tabId].nodes.reduce((prev, curr) => prev > curr.x ? prev : curr.x, 0) + 530),
      Math.max(this.wrapper.clientHeight, this.project.openBlueprints[this.tabId].nodes.reduce((prev, curr) => prev > Math.abs(curr.y) ? prev : Math.abs(curr.y), 0) + 530),
    ]
    this.context = this.canvas.getContext("2d");
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.overlay.style.width = w + "px";
    this.overlay.style.height = h + "px";
    this.wrapper.scrollTop = this.wrapper.scrollTopMax / 2;
  }

  /**
   * Scroll event
   */
  private onScroll() {
    if (this.drawState === "drawing") {
      this.drawGhostNodeAndRel(this.mousePos);
    }
    if (this.wrapper.scrollTop < 20)
      this.scrollPoles.add("north");
    else this.scrollPoles.delete("north");
    if (this.wrapper.scrollTop > this.wrapper.scrollTopMax - 20)
      this.scrollPoles.add("south");
    else this.scrollPoles.delete("south");
    if (this.wrapper.scrollLeft > this.wrapper.scrollLeftMax - 20)
      this.scrollPoles.add("east");
    else this.scrollPoles.delete("east");
  }
  /**
   * Mouse Move event
   */
  private onMouseMove(e: MouseEvent) {
    if (this.drawState === "drawing" || this.drawState === "dragging") {
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
    } if (this.drawState === "drawing")
      this.drawGhostNodeAndRel([e.x, e.y]);

  }
  /**
   * On mouse click event
   */
  private onClick(e: MouseEvent) {
    if (this.drawState === "drawing") {
      e.preventDefault();
      this.drawState = "none";
      this.socket.socket.emit(Flags.CREATE_NODE, new CreateNodeRes(
        this.parentGhost.data.id,
        this.docId,
        this.ghostNode[0],
        this.ghostNode[1] - this.overlay.clientHeight / 2,
        this.drawingOriginPos[0],
        this.drawingOriginPos[1] - this.overlay.clientHeight / 2
      ));
      this.ghostNode = null;
    }
  }

  /**
   * Draw a ghost node on the canvas that follow the mouse
   * Use bezier curve to draw relations
   */
  private drawGhostNodeAndRel(pos: Tuple) {
    let [ox, oy] = this.drawingOriginPos;
    let [ex, ey] = [pos[0], pos[1] - 48];
    ex += this.wrapper.scrollLeft;
    ey += this.wrapper.scrollTop;
    ex = Math.min(ex, this.canvas.width - this.ghostSize[0]);
    ey = Math.min(ey, this.canvas.height - this.ghostSize[1]);
    oy -= 48;

    this.drawRelations();
    this.drawCurve([ox, oy], [ex, ey], false);
    this.ghostNode = [ex, ey];
  }

  public drawRelations() {
    const blueprint = this.project.openBlueprints[this.tabId];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    for (const rel of blueprint.relationships) {
      this.drawCurve([rel.ox, rel.oy - 48], [rel.ex, rel.ey]);
    }
  }
  private drawGrid(step = 80) {
    this.context.strokeStyle = "#ffffff1f";
    this.context.lineWidth = 0.25;
    this.context.beginPath();
    //horizontal lines
    for (let i = 0; i <= this.canvas.width; i += step) {
      this.context.moveTo(0, i);
      this.context.lineTo(this.canvas.width, i);
    }
    //vertical lines
    for (let i = 0; i <= this.canvas.width; i += step) {
      this.context.moveTo(i, 0);
      this.context.lineTo(i, this.canvas.height);
    }
    this.context.stroke();
    this.context.closePath();
  }

  private drawCurve(o: Tuple, e: Tuple, rel = true) {
    this.context.lineWidth = 1;
    const [ox, oy] = o;
    const [ex, ey] = e;
    const [w, h] = [-(ox - ex), oy - ey];
    const [p1x, p1y, p2x, p2y] = [ox + w / 2, oy, ox + w / 2, ey];
    const half = rel ? this.overlay.clientHeight / 2 : 0;
    this.context.strokeStyle = "#b0bec5";
    this.context.beginPath();
    this.context.moveTo(ox, oy + half);
    this.context.bezierCurveTo(p1x, p1y + half, p2x, p2y + half, ex, ey + half);
    this.context.stroke();
    this.context.closePath();
    this.drawSkeleton([ox, oy], [w, h], [p1x, p1y, p2x, p2y], rel);
  }

  public beginGhostRelation(parent: NodeComponent, e: Tuple) {
    e[0] += this.wrapper.scrollLeft;
    e[1] += this.wrapper.scrollTop;
    this.drawState = "drawing";
    this.ghostSize = [parent.wrapper.nativeElement.clientWidth, parent.wrapper.nativeElement.clientHeight];
    this.drawingOriginPos = e;
    this.ghostNode = e;
    this.parentGhost = parent;
  }
  public bindRelation(child: NodeComponent, anchorPos: Tuple) {
    if (this.drawState === "drawing") {
      this.socket.socket.emit(Flags.CREATE_RELATION, new Relationship({
        parentId: this.parentGhost.data.id,
        childId: child.data.id,
        blueprint: this.project.openBlueprints[this.tabId],
        ex: anchorPos[0] + this.wrapper.scrollLeft,
        ey: anchorPos[1] + this.wrapper.scrollTop - this.overlay.clientHeight / 2 - 48,
        ox: this.drawingOriginPos[0],
        oy: this.drawingOriginPos[1] - this.overlay.clientHeight / 2
      }));
      this.ghostNode = null;
      this.drawState = "none";
    }
  }

  /**
   * AddaptViewport to Mouse (increase viewport and scroll)
   */
  private adaptViewport(treshold: Poles[]) {
    if (treshold.includes("north") && this.wrapper.scrollTop > 10)
      this.wrapper.scrollBy({ top: - 10, behavior: 'auto' });
    if (treshold.includes("south") && this.wrapper.scrollTop + 20 < this.wrapper.scrollTopMax)
      this.wrapper.scrollBy({ top: 10, behavior: 'auto' });
    if (treshold.includes("east") && this.wrapper.scrollLeft + 20 < this.wrapper.scrollLeftMax)
      this.wrapper.scrollBy({ left: 10, behavior: 'auto' });
    if (treshold.includes("west") &&  this.wrapper.scrollLeft > 10)
      this.wrapper.scrollBy({ left: - 10, behavior: 'auto' });
  }

  /**
   * Detect if the mouse is in a Pole
   */
  private tresholdMouse(pos: Tuple): Poles[] {
    const treshold = 48;
    const poles: Poles[] = [];
    if (pos[1] - 48 < treshold)
      poles.push("north");
    if (pos[1] > window.innerHeight - treshold)
      poles.push("south");
    if (pos[0] > this.wrapper.clientWidth - treshold)
      poles.push("east");
    if (pos[0] < treshold)
      poles.push("west");
    return poles;
  }
  /**
   * Update the size of the viewport
   */
  public widenViewport(pole: Poles) {
    this.canvas.width += pole === "east" ? 500 : 0;
    this.canvas.height += pole === "north" || pole === "south" ? 1000 : 0;
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    this.overlay.style.width = this.canvas.width + "px";
    this.overlay.style.height = this.canvas.height + "px";
    if (pole === "north" || pole === "south")
      this.wrapper.scrollTop += 500;
    if (this.drawState === "drawing" && (pole === "north" || pole === "south"))
      this.drawingOriginPos[1] += 500;
    else if (this.drawState === "dragging" && pole === "east")
      this.drawingOriginPos[0] += 500;
  }

  public onDragStart(node: NodeComponent) {
    this.drawState = "dragging";
    this.draggedNode = node;
    this.draggedRelationships = this.project.openBlueprints[this.tabId].relationships
      .filter(el => el.childId === node.data.id || el.parentId === node.data.id)
      .map(el => Object.assign({}, el));
  }
  public onDragMove(offset: Tuple) {
    for (const rel of this.project.openBlueprints[this.tabId].relationships) {
      const oldRel = this.draggedRelationships.find(el => el.id === rel.id);
      // console.log(oldRel, offset);
      if (rel.childId === this.draggedNode.data.id) {
        rel.ex = oldRel.ex - offset[0];
        rel.ey = oldRel.ey - offset[1];
      } else if (rel.parentId === this.draggedNode.data.id) {
        rel.ox = oldRel.ox - offset[0];
        rel.oy = oldRel.oy - offset[1];
      }
    }
    this.drawRelations();
  }
  public onDragEnd(node: Node, pos: [number, number]) {
    const blueprint = this.project.openBlueprints[this.tabId];
    const nodeData = blueprint.nodes.find(el => el.id === node.id);
    nodeData.x -= pos[0];
    nodeData.y -= pos[1];
    for (const rel of blueprint.relationships) {
      if (rel.childId === node.id) {
        this.socket.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
      } else if (rel.parentId === this.draggedNode.data.id) {
        this.socket.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
      }
    }
    this.socket.socket.emit(Flags.PLACE_NODE, new PlaceNodeOut(this.docId, node.id, [nodeData.x, nodeData.y]));
    this.draggedNode = null;
    this.draggedRelationships = null;
    this.drawState = "none";
  }
  /**
   * Draw the skeleton if the option is enabled
   */
  private drawSkeleton(o: Tuple, s: Tuple, p: [number, number, number, number], rel: boolean) {
    if (!this.enableSkeleton)
      return;
    const half = rel ? this.overlay.clientHeight / 2 : 0;
    this.context.beginPath();
    this.context.arc(p[0], p[1] + half, 5, 0, 2 * Math.PI);  // Control point one
    this.context.fillStyle = "red";
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.arc(p[2], p[3] + half, 5, 0, 2 * Math.PI);  // Control point two
    this.context.fillStyle = "blue";
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.strokeStyle = "yellow";
    this.context.moveTo(o[0], o[1] + half);
    this.context.lineTo(o[0] + s[0] / 2, o[1] + half);
    this.context.moveTo(o[0] + s[0] / 2, o[1] + half);
    this.context.lineTo(o[0] + s[0] / 2, o[1] - s[1] + half);
    this.context.moveTo(o[0] + s[0] / 2, o[1] - s[1] + half);
    this.context.lineTo(o[0] + s[0], o[1] - s[1] + half);
    this.context.stroke();
    this.context.closePath();
  }

  /** 
   * Method to autoPositionate each node and relations 
   */
  public async autoPos() {
    console.time("a");
    this.progress.show();
    let nodes = this.project.openBlueprints[this.tabId].nodes;
    let rels = this.project.openBlueprints[this.tabId].relationships;
    const margin: Vector = [100, 50];
    for (const node of nodes) {
      const el = this.component.getNodeEl(node.id).wrapper.nativeElement;
      node.width = el.clientWidth;
      node.height = el.clientHeight;
    }
    const data: [Node[], Relationship[]] = await this.blueprintWorker.postAsyncMessage(`autopos-${this.tabId}`, [nodes, rels, margin]);
    if (!data) {
      this.snack.snack("Ouups ! Impossible d'agencer cet arbre");
      console.timeEnd("a");
      return;
    }
    this.project.openBlueprints[this.tabId].nodes = nodes = data[0];
    this.project.openBlueprints[this.tabId].relationships = rels = data[1];

    this.configSize();
    this.drawRelations();
    console.timeEnd("a");
    this.progress.hide();
    for (const rel of rels)
      this.socket.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
    for (const node of nodes)
      this.socket.socket.emit(Flags.PLACE_NODE, new PlaceNodeOut(this.docId, node.id, [node.x, node.y]));
  }
}

type DrawStates = "drawing" | "dragging" | "none";
type Tuple = [number, number];
