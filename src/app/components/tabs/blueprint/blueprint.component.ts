import { Vector } from './../../../../types/global.d';
import { ConfirmComponent } from './../../utils/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { ProgressService } from './../../../services/progress.service';
import { SocketService } from './../../../services/socket.service';
import { Blueprint, Node, RemoveNodeOut, Relationship, CreateNodeRes, PlaceNodeOut, CreateRelationReq } from './../../../models/sockets/blueprint-sock.model';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { ProjectService } from './../../../services/project.service';
import { Component, ViewChild, ElementRef, AfterViewChecked, ViewChildren, QueryList, OnInit, ChangeDetectorRef } from '@angular/core';
import { v4 as uuid4 } from "uuid";
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Poles, NodeComponent } from './node/node.component';
import { findChildRels, findLevelByNode, findNodesByLevel, findParentRels, removeNodeFromTree } from 'src/app/utils/tree.utils';
import { WorkerManager, WorkerType } from 'src/app/utils/worker-manager.utils';
import { SnackbarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent implements ITabElement, AfterViewChecked, OnInit {

  @ViewChild("wrapper", { static: false })
  public wrapperEl: ElementRef<HTMLDivElement>;

  @ViewChild("overlayEl", { static: false })
  public overlayEl: ElementRef<HTMLDivElement>;

  @ViewChild("rootEl", { static: false })
  public rootEl: NodeComponent;

  @ViewChildren("nodeEl")
  public nodeEls: QueryList<NodeComponent>;

  public initialized = false;
  public tabId: string;
  public show: boolean;
  public magnetMode = false;
  public autoMode: boolean;
  public gridMode: boolean;
  public scrollPoles: Set<Poles> = new Set();
  public drawState: DrawStates = "none";
  public scale: number;

  public readonly type = TabTypes.BLUEPRINT;
  public ghostNode?: TemporaryNode;
  private scroll: Vector;
  private scrollIntervalId: number;
  private tresholdMousePole: Poles[];
  private readonly blueprintWorker: WorkerManager;



  constructor(
    private readonly dialog: MatDialog,
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly progress: ProgressService,
    private readonly snack: SnackbarService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {
    this.blueprintWorker = new WorkerManager(WorkerType.Blueprint);
  }

  public ngOnInit() {
    this.autoMode = this.project.autoMode;
    this.gridMode = this.project.dispGrid;
  }

  ngAfterViewChecked() {
    // if (this.canvas && this.tabId && !this.initialized) {
    // this.blueprintHandler.init(this);
    // this.initialized = true;
    // }
  }

  public onFocus() {
    if (this.initialized) {
      window.setTimeout(() => {
        this.wrapper.scrollTo({ left: this.scroll?.[0], top: this.scroll?.[1], behavior: "auto" });
      });
    }
  }
  public onUnFocus() {
    this.scroll = [this.wrapper?.scrollLeft, this.wrapper?.scrollTop];
  }

  public openTab(id?: string | number): string {
    this.tabId = uuid4();
    this.progress.show();
    this.socket.socket.emit(Flags.OPEN_BLUEPRINT, [this.tabId, id]);
    return this.tabId;
  }

  public loadedTab() {
    this.progress.hide();
  }

  public onWheel(e: WheelEvent | number): void {
    //TODO: Implement zoom !
  }
  /**
   * On mouse click event
   */
  public onClick(e: MouseEvent) {
    if (this.drawState === "drawing") {
      e.preventDefault();
      this.createNewNode([this.ghostNode.ox, this.ghostNode.oy], [this.ghostNode.ex, this.ghostNode.ey], this.ghostNode.parent.id);
      this.drawState = "none";
      this.ghostNode = null;
    }
  }

  private createNewNode([ox, oy]: Vector, [ex, ey]: Vector, parentId: number) {
    this.socket.socket.emit(Flags.CREATE_NODE, new CreateNodeRes(
      parentId,
      this.id,
      ex,
      ey - this.overlay.clientHeight / 2,
      ox,
      oy - this.overlay.clientHeight / 2,
      0,
    ));
  }

  private configSize() {
    const [w, h] = [
      Math.max(this.wrapper.clientWidth, this.nodes.reduce((prev, curr) => prev > curr.x ? prev : curr.x, 0) + 530),
      Math.max(this.wrapper.clientHeight, this.nodes.reduce((prev, curr) => prev > Math.abs(curr.y) ? prev : Math.abs(curr.y), 0) + 530),
    ]
    this.overlay.style.width = w + "px";
    this.overlay.style.height = h + "px";
  }


  public onScroll(e: MouseEvent) {
    if (this.drawState === "drawing")
      this.moveGhost([e.clientX, e.clientY]);
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

  private moveGhost(pos: Vector) {
    let [ex, ey] = [pos[0], pos[1] - 48];
    ex += this.wrapper.scrollLeft;
    ey += this.wrapper.scrollTop;
    ex = Math.min(ex, this.overlay.clientWidth - this.ghostNode.w);
    ey = Math.min(ey, this.overlay.clientHeight);

    this.ghostNode.ex = ex;
    this.ghostNode.ey = ey;
    this.changeDetector.detectChanges();
  }

  public beginRelation(parent: NodeComponent, pos: [number, number, Poles, boolean?]) {
    const rightClick = pos[3] || false;
    const pole = pos[2];
    pos[0] += this.wrapper.scrollLeft;
    pos[1] += this.wrapper.scrollTop;
    if (this.autoMode && !rightClick) {
      this.createNewNode([pos[0], pos[1] - 48], [pos[0] + 100, pos[1]], parent.data.id);
    } else {
      this.drawState = "drawing";
      this.ghostNode = {
        w: parent.wrapper.nativeElement.clientWidth,
        h: parent.wrapper.nativeElement.clientHeight,
        ox: pos[0],
        oy: pos[1] - 48,
        ex: pos[0],
        ey: pos[1] - 48,
        pole,
        parent: parent.data
      }
    }
  }

  public bindRelation(child: NodeComponent, anchorPos: [number, number]) {
    const childLevel = findLevelByNode(child.data, this.root, this.nodes, this.blueprint.relationships);
    const parentLevel = findLevelByNode(this.allNodes.find(el => el.id == this.ghostNode.parent.id), this.root, this.nodes, this.blueprint.relationships);
    if (childLevel > parentLevel) {
      this.socket.socket.emit(Flags.CREATE_RELATION, new Relationship({
        parentId: this.ghostNode.parent.id,
        childId: child.data.id,
        blueprint: this.blueprint,
        ex: anchorPos[0] + this.wrapper.scrollLeft,
        ey: anchorPos[1] + this.wrapper.scrollTop - this.overlay.clientHeight / 2 - 48,
        ox: this.ghostNode.ox,
        oy: this.ghostNode.oy - this.overlay.clientHeight / 2
      }));
      this.ghostNode = null;
      this.drawState = "none";
    }
  }

  public onRemove(el: NodeComponent) {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer ce noeud et tous ses enfants orphelins ?" });
    dialog.componentInstance.confirm.subscribe(() => {
      dialog.close();
      const data = removeNodeFromTree(el.data.id,
        this.nodes.map(el => el.id),
        this.blueprint.relationships.map(el => [el.parentId, el.childId, el.id])
      );
      this.project.openBlueprints[this.tabId].nodes = this.project.openBlueprints[this.tabId].nodes.filter(el => !data.nodes.includes(el.id));
      this.project.openBlueprints[this.tabId].relationships = this.project.openBlueprints[this.tabId].relationships.filter(el => !data.rels.includes(el.id));
      this.socket.socket.emit(Flags.REMOVE_NODE, new RemoveNodeOut(el.data.id, this.id));
    });
  }

  public onMouseDown(e: MouseEvent) {
    if ((e.target as HTMLDivElement)?.classList.contains("overlay") && this.drawState === "none") {
      e.stopImmediatePropagation();
      e.preventDefault();
      this.drawState = "moving";
    }
  }
  public onMouseUp(e: MouseEvent) {
    if (this.drawState == "moving")
      this.drawState = "none";
  }
  public onMouseMove(e: MouseEvent) {
    if (this.drawState === "moving") {
      e.stopImmediatePropagation();
      e.preventDefault();
      this.wrapper.scrollTop -= e.movementY;
      this.wrapper.scrollLeft -= e.movementX;
    }
    else if (this.drawState === "drawing" || this.drawState === "dragging") {
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
      this.moveGhost([e.x, e.y]);

  }
  public onWiden(pole: Poles) {
    this.overlay.style.width = this.overlay.clientWidth + (pole === "east" ? 500 : 0) + "px";
    this.overlay.style.height = this.overlay.clientHeight + (pole === "north" || pole === "south" ? 1000 : 0) + "px";
    if (pole === "north" || pole === "south")
      this.wrapper.scrollTop += 500;
    if (this.drawState === "drawing" && (pole === "north" || pole === "south"))
      this.ghostNode.ey += 500;
    else if (this.drawState === "dragging" && pole === "east")
      this.ghostNode.ex += 500;
  }

  public getNodeEl(id: number): NodeComponent {
    return this.nodeEls.find(el => el.data.id === id) || this.rootEl.data.id === id ? this.rootEl : null;
  }
  
  public onDragStart() {
    this.drawState = "dragging";
  }
  public onDragMove(offset: Vector, node: Node) {
    const parentRel = findParentRels(node, this.rels);
    const childRel = findChildRels(node, this.rels);
    for (const rel of parentRel) {
      rel.ex -= offset[0];
      rel.ey -= offset[1];
    }
    for (const rel of childRel) {
      rel.ox -= offset[0];
      rel.oy -= offset[1];
    }
    node.x -= offset[0];
    node.y -= offset[1];
  }

  public onDragEnd(pos: Vector, node: Node) {
    const nodeData = this.nodes.find(el => el.id === node.id);
    this.onDragMove(pos, node);
    for (const rel of this.rels) {
      if (rel.childId === node.id) {
        this.socket.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
      } else if (rel.parentId === node.id)
        this.socket.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
    }
    this.socket.socket.emit(Flags.PLACE_NODE, new PlaceNodeOut(this.id, node.id, [nodeData.x, nodeData.y]));
    this.drawState = "none";
  }



  /**
   * Detect if the mouse is in a Pole
   */
  private tresholdMouse(pos: Vector): Poles[] {
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
   * Method to autoPositionate each node and relations.
   * If a node is provided only this node level will be autopos
   */
  public async autoPos(node?: Node) {
    console.time("auto-pos");
    this.progress.show();
    let nodes = this.allNodes;
    const margin: Vector = [100, 50];
    for (const node of nodes) {
      const el = this.getNodeEl(node.id).wrapper.nativeElement;
      node.width = el.clientWidth;
      node.height = el.clientHeight;
    }
    const data: [Node[], Relationship[]] = await this.blueprintWorker.postAsyncMessage(`autopos-${this.tabId}`, [nodes, this.rels, margin, node]);
    if (!data) {
      this.snack.snack("Ouups ! Impossible d'agencer cet arbre");
      console.timeEnd("auto-pos");
      return;
    }
    this.nodes = nodes = data[0];
    this.rels = data[1];
    this.configSize();
    console.timeEnd("auto-pos");
    this.progress.hide();
    for (const rel of this.rels)
      this.socket.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
    for (const node of nodes)
      this.socket.socket.emit(Flags.PLACE_NODE, new PlaceNodeOut(this.id, node.id, [node.x, node.y]));
  }


  get blueprint(): Blueprint {
    return this.project.openBlueprints[this.tabId];
  }
  get root(): Node {
    return this.blueprint?.nodes?.find(el => el.isRoot);
  }
  get nodes(): Node[] {
    return this.blueprint?.nodes?.filter(el => !el.isRoot);
  }
  get allNodes(): Node[] {
    return this.blueprint?.nodes;
  }
  get rels(): Relationship[] {
    return this.blueprint.relationships;
  }
  set nodes(nodes: Node[]) {
    this.project.openBlueprints[this.tabId].nodes = nodes;
  }
  set rels(rels: Relationship[]) {
    this.project.openBlueprints[this.tabId].relationships = rels;
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

  private get wrapper(): HTMLDivElement {
    return this.wrapperEl.nativeElement;
  }
  private get overlay(): HTMLDivElement {
    return this.overlayEl.nativeElement;
  }
}

export type DrawStates = "moving" | "drawing" | "dragging" | "none";
export interface TemporaryNode {
  ox: number;
  oy: number;
  ex: number;
  ey: number;
  h: number;
  w: number;
  parent: Node;
  pole: Poles
}