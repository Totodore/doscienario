import { TreeIoHandler } from './../../../services/sockets/tree-io.handler.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { Blueprint, Node, Relationship } from 'src/app/models/api/blueprint.model';
import { Tag } from 'src/app/models/api/tag.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { CreateNodeOut, PlaceNodeOut, RemoveNodeOut } from 'src/app/models/sockets/out/blueprint.out';
import { AddTagElementOut } from 'src/app/models/sockets/out/tag.out';
import { ITabElement, TabTypes } from 'src/app/models/sys/tab.model';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { SnackbarService } from 'src/app/services/ui/snackbar.service';
import { findChildRels, findLevelByNode, findParentRels, removeNodeFromTree } from 'src/app/utils/tree.utils';
import { WorkerManager, WorkerType } from 'src/app/utils/worker-manager.utils';
import { ProgressService } from '../../../services/ui/progress.service';
import { ElementComponent } from '../element.component';
import { Vector } from './../../../../types/global.d';
import { ProjectService } from './../../../services/project.service';
import { ConfirmComponent } from './../../utils/confirm/confirm.component';
import { NodeComponent, Poles } from './node/node.component';
import { scale, translate, compose, Matrix, toCSS, decomposeTSR, identity } from 'transformation-matrix';


@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent extends ElementComponent implements ITabElement, OnInit {

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

  public readonly type = TabTypes.BLUEPRINT;
  public ghostNode?: TemporaryNode;

  private scrollIntervalId: number;
  private tresholdMousePole: Poles[];
  private transformMatrix: Matrix = identity();
  private readonly blueprintWorker: WorkerManager;

  constructor(
    private readonly dialog: MatDialog,
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    progress: ProgressService,
    private readonly snack: SnackbarService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly logger: NGXLogger,
    _: TreeIoHandler,   // Unused tree io handler in the current class but it should be declarated somewhere to be included in the bundle
  ) {
    super(progress);
    this.blueprintWorker = new WorkerManager(WorkerType.Blueprint, this.logger);
  }

  /**
   * Load default options
   */
  public ngOnInit() {
    this.autoMode = this.project.autoMode;
    this.gridMode = this.project.dispGrid;
  }

  /**
   * When the tab is opened with an optional blueprint id we request the blueprint loading 
   * We also generate a tabId
   */
  public openTab(id?: string | number): string {
    super.openTab(id);
    this.socket.emit(Flags.OPEN_BLUEPRINT, [this.tabId, id]);
    return this.tabId;
  }

  public loadedTab() {
    super.loadedTab();
    this.configView();
  }

  /**
   * Allow the user to zoom on the viewport (can be call from a wheel event or from another ui method)
   * */
  public onWheel(e: WheelEvent | number): void {
    if (e instanceof WheelEvent) {
      e.preventDefault();
      if ((this.transformMatrix.a >= 1 && e.deltaY < 0) || (this.transformMatrix.a <= 0.2 && e.deltaY > 0))
        return;
      const ratio = (-e.deltaY > 0) ? 1.1 : 1 / 1.1;
      const matrix = compose(
        this.transformMatrix,
        scale(ratio, ratio, e.clientX - this.wrapper.clientWidth / 2, e.clientY - this.wrapper.clientHeight / 2),
      );
      matrix.a = matrix.d = Math.clamp(matrix.a, 0.2, 1);
      this.transformMatrix = matrix;
    } else {
      if (e > 1 || e < 0.2)
        return;
      this.transformMatrix.a = this.transformMatrix.d = e;
    }
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
    this.socket.emit(Flags.CREATE_NODE, new CreateNodeOut(
      parentId,
      this.id,
      ex,
      ey,
      ox,
      oy,
      0,
    ));
  }

  /**
   * Set the middle scroll position
   * It is call each time the zooming Matrix change so the scroll can be readjusted
  */
  private configView() {
    const width = this.overlay.clientWidth;
    const height = this.overlay.clientHeight;
    const viewHeight = this.wrapper.clientHeight;
    this.transformMatrix = translate(- width / 2, - (height / 2 - viewHeight / 2));
  }


  public onScroll(e: WheelEvent) {
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
    const rec = this.overlay.getBoundingClientRect();
    this.ghostNode.ex = (pos[0] / this.overlayScale) - rec.left - rec.width / 2;
    this.ghostNode.ey = (pos[1] / this.overlayScale) - rec.top - rec.height / 2;
    this.changeDetector.detectChanges();
  }

  public beginRelation(parent: NodeComponent, pos: [number, number, Poles, boolean?]) {
    const rightClick = pos[3] || false;
    const pole = pos[2];
    if (this.autoMode && !rightClick) {
      this.createNewNode([
        pos[0],
        pos[1]
      ], [
        pos[0] + 100,
        pos[1]
      ], parent.data.id);
    } else {
      this.drawState = "drawing";
      this.ghostNode = {
        w: parent.wrapper.nativeElement.clientWidth,
        h: parent.wrapper.nativeElement.clientHeight,
        ox: pos[0],
        oy: pos[1],
        ex: pos[0],
        ey: pos[1],
        pole,
        parent: parent.data
      }
    }
  }

  public bindRelation(child: NodeComponent, anchorPos: [number, number]) {
    const childLevel = findLevelByNode(child.data, this.root, this.nodes, this.blueprint.relationships);
    const parentLevel = findLevelByNode(this.allNodes.find(el => el.id == this.ghostNode.parent.id), this.root, this.nodes, this.blueprint.relationships);
    if (childLevel > parentLevel) {
      this.socket.emit(Flags.CREATE_RELATION, new Relationship({
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
      this.socket.emit(Flags.REMOVE_NODE, new RemoveNodeOut(el.data.id, this.id));
    });
  }

  /**
   * start the moving system in order to move around the blueprint
   * @param e 
   */
  public onMouseDown(e: MouseEvent) {
    if ((e.target as HTMLDivElement)?.classList.contains("overlay") && this.drawState === "none") {
      e.stopImmediatePropagation();
      e.preventDefault();
      this.drawState = "moving";
    }
  }
  /**
   * Stop the moving system in the blueprint
   * @param e 
   */
  public onMouseUp(e: MouseEvent) {
    if (this.drawState == "moving")
      this.drawState = "none";
  }
  /**
   * Handle the mouse moving event on the blueprint, handle mouse scrolling, mouse drawing and mouse dragging
   * @param e 
   */
  public onMouseMove(e: MouseEvent) {
    if (this.drawState === "moving") {
      e.stopImmediatePropagation();
      e.preventDefault();
      const zoom = this.overlayScale;
      this.transformMatrix = compose(
        this.transformMatrix,
        translate(e.movementX / zoom, e.movementY / zoom),
      );
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
    } if (this.drawState === "drawing") {
      this.moveGhost([e.x, e.y]);
    }

  }
  /**
   * Enable dragging mode
   */
  public onDragStart() {
    this.drawState = "dragging";
  }
  /**
   * Move all parent and child rel of a moving node
   * @param offset the moving offset
   * @param node the node that is moving
   */
  public onDragMove(offset: Vector, node: Node, component: NodeComponent): void {
    const overlayRect = this.overlay.getBoundingClientRect();
    const wrapperRect = component.wrapper.nativeElement.getBoundingClientRect();
    let x = offset[0] - (overlayRect.width / 2) / (this.overlayScale) - wrapperRect.width;
    let y = offset[1] - (overlayRect.height / 2) / (this.overlayScale) + wrapperRect.height / 2;
    x -= node.x;
    y -= node.y;
    const parentRel = findParentRels(node, this.rels);
    const childRel = findChildRels(node, this.rels);
    for (const rel of parentRel) {
      rel.ex += x;
      rel.ey += y;
    }
    for (const rel of childRel) {
      rel.ox += x;
      rel.oy += y;
    }
    node.x += x;
    node.y += y;
  }

  /**
   * End the node grabbing mode
   * Save parent and child relationships, save moved none
   * @param pos the last offset
   * @param node the grabbed node
   */
  public onDragEnd(node: Node): void {
    const nodeData = this.nodes.find(el => el.id === node.id);
    for (const rel of this.rels) {
      if (rel.childId === node.id) {
        this.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
      } else if (rel.parentId === node.id)
        this.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
    }
    this.socket.emit(Flags.PLACE_NODE, new PlaceNodeOut(this.id, node.id, [nodeData.x, nodeData.y]));
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
    if (treshold.includes("west") && this.wrapper.scrollLeft > 10)
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
    console.timeEnd("auto-pos");
    this.progress.hide();
    for (const rel of this.rels)
      this.socket.emit(Flags.PLACE_RELATIONSHIP, rel);
    for (const node of nodes)
      this.socket.emit(Flags.PLACE_NODE, new PlaceNodeOut(this.id, node.id, [node.x, node.y]));
  }

  /**
   * Get a node element from the node id
   * @param id the id of the node
   * @returns the node component
   */
  private getNodeEl(id: number): NodeComponent {
    return this.nodeEls.find(el => el.data.id === id) || this.rootEl.data.id === id ? this.rootEl : null;
  }

  /**
   * Add element tag and wait that doc is loaded before adding element tag if needed
  */
  public async addTags(tags: Tag[]) {
    if (!this.loaded)
      await new Promise<void>(resolve => setInterval(() => this.loaded && resolve(), 100));
    this.project.updateBlueprintTags(this.tabId, tags);
    for (const tag of tags)
      this.socket.emit(Flags.TAG_ADD_BLUEPRINT, new AddTagElementOut(this.id, tag.title));
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
    else if (this.blueprint.title?.length == 0)
      return "Nouvel arbre";
    else return this.blueprint.title;
  }

  get id(): number {
    return this.blueprint?.id;
  }
  public get cssTransformMatrix() {
    return toCSS(this.transformMatrix);
  }
  public get overlayScale() {
    return this.transformMatrix.a;
  }
  public get overlayTranslation() {
    return decomposeTSR(this.transformMatrix).translate;
  }

  private get wrapper(): HTMLDivElement {
    return this.contentElement = this.wrapperEl?.nativeElement;
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