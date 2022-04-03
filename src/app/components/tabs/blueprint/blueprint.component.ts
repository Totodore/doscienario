import { TreeIoHandler } from './../../../services/sockets/tree-io.handler.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { Blueprint, BlueprintSock, Node, Pole, Relationship } from 'src/app/models/api/blueprint.model';
import { Tag } from 'src/app/models/api/tag.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { CreateNodeOut, PlaceNodeOut, RemoveNodeOut } from 'src/app/models/sockets/out/blueprint.out';
import { AddTagElementOut } from 'src/app/models/sockets/out/tag.out';
import { ITabElement, TabTypes } from 'src/app/models/sys/tab.model';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { SnackbarService } from 'src/app/services/ui/snackbar.service';
import { findChildRels, findLevelByNode, findParentRels, getTreeRect, removeNodeFromTree } from 'src/app/utils/tree.utils';
import { WorkerManager, WorkerType } from 'src/app/utils/worker-manager.utils';
import { ProgressService } from '../../../services/ui/progress.service';
import { ElementComponent } from '../element.component';
import { Vector } from './../../../../types/global.d';
import { ProjectService } from './../../../services/project.service';
import { ConfirmComponent } from './../../utils/confirm/confirm.component';
import { NodeComponent } from './node/node.component';
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
  public scrollPoles: Set<Pole> = new Set();
  public drawState: DrawStates = "none";

  public readonly type = TabTypes.BLUEPRINT;
  public ghostNode?: TemporaryNode;

  private scrollIntervalId: number;
  private tresholdMousePole: Pole[];
  private transformMatrix: Matrix = identity();
  private movingNodeData: MovingNodeData;
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
    this.autoSizeViewport();
  }

  /**
   * Allow the user to zoom on the viewport (can be call from a wheel event or from another ui method)
   * */
  public onWheel(e: WheelEvent): void {
    e.preventDefault();
    if (e.ctrlKey)
      this.onZoom((-e.deltaY > 0) ? 1.1 : 1 / 1.1);
    else {
      const zoom = this.overlayScale;
      this.transformMatrix = compose(
        this.transformMatrix,
        translate(-e.deltaX / zoom, -e.deltaY / zoom),
      );
    }
    this.logger.log("Updating transform matrix", this.cssTransformMatrix);
  }

  public onZoom(ratio: number): void {
    if (ratio < 1.5 && ratio > 0.5) {
      if ((this.overlayScale >= 1 && ratio > 1) || (this.overlayScale <= 0.2 && ratio < 1))
        return;
      const [ox, oy] = [
        - this.overlayTranslation.tx / this.overlayScale + this.wrapper.clientWidth / 2,
        - this.overlayTranslation.tx / this.overlayScale + this.wrapper.clientHeight / 2
      ];
      if (this.overlayScale * ratio <= 0.2) {
        this.transformMatrix = compose(
          this.transformMatrix,
          scale(0.2 / this.overlayScale, 0.2 / this.overlayScale, ox, oy),
        );
      } else if (this.overlayScale * ratio >= 1) {
        this.transformMatrix = compose(
          this.transformMatrix,
          scale(1 / this.overlayScale, 1 / this.overlayScale, ox, oy),
        )
      } else {
        this.transformMatrix = compose(
          this.transformMatrix,
          scale(ratio, ratio, ox, oy),
        );
      }
    }
    else if (ratio >= 20 && ratio <= 100)
      this.transformMatrix.a = this.transformMatrix.d = ratio / 100;
  }
  /**
   * On mouse click event
   */
  public onClick(e: MouseEvent) {
    if (this.drawState === "drawing") {
      e.preventDefault();
      this.createNewNode(
        [this.ghostNode.ox, this.ghostNode.oy],
        [this.ghostNode.ex, this.ghostNode.ey],
        Pole.East, Pole.West,
        this.ghostNode.parent.id);
      this.drawState = "none";
      this.ghostNode = null;
    }
  }

  private createNewNode([ox, oy]: Vector, [ex, ey]: Vector, parentPole: Pole, childPole: Pole, parentId: number) {
    this.socket.emit(Flags.CREATE_NODE, new CreateNodeOut(
      parentId,
      this.id,
      ex,
      ey,
      ox,
      oy,
      0,
      parentPole,
      childPole,
    ));
  }

  /**
   * Set the middle scroll position
   * It is call each time the zooming Matrix change so the scroll can be readjusted
  */
  public autoSizeViewport() {
    const overlayWidth = this.overlay.clientWidth;
    const overlayHeight = this.overlay.clientHeight;
    const viewHeight = this.wrapper.clientHeight;
    const viewWidth = this.wrapper.clientWidth;
    if (this.nodeEls.length == 0) {
      this.transformMatrix = compose(
        scale(1),
        translate(- overlayWidth / 2, - overlayHeight / 2 + viewHeight / 2),
      );
    } else {

      const treeBoxs: DOMRect[] = this.nodeEls.map(node => {
        const width = node.wrapper.nativeElement.getBoundingClientRect().width / this.overlayScale;
        const height = node.wrapper.nativeElement.getBoundingClientRect().height / this.overlayScale;
        return {
          x: overlayWidth / 2 + node.data.x,
          y: overlayHeight / 2 + node.data.y,
          left: overlayWidth / 2 + node.data.x,
          top: overlayHeight / 2 + node.data.y,
          width,
          height,
          bottom: overlayHeight / 2 + node.data.y + width,
          right: overlayWidth / 2 + node.data.x + height,
          toJSON: null,
        };
      });
      const treeRect = getTreeRect(treeBoxs, overlayWidth / 2, overlayHeight / 2);
      const scalingRatio = Math.max(0.2, Math.min(viewWidth / treeRect.width, viewHeight / treeRect.height, 1) * 0.9);
      this.transformMatrix = compose(
        scale(scalingRatio, scalingRatio, 0, 0),
        translate(- treeRect.left, - treeRect.top),
        translate((viewWidth - treeRect.width * scalingRatio) / 2, (viewHeight - treeRect.height * scalingRatio) / 2),
      );
    }
    this.logger.log("Updating transform matrix", this.cssTransformMatrix);
  }


  public onScroll(e: WheelEvent) {
    if (this.drawState === "drawing")
      this.moveGhost([e.clientX, e.clientY]);
    if (this.wrapper.scrollTop < 20)
      this.scrollPoles.add(Pole.North);
    else this.scrollPoles.delete(Pole.North);
    if (this.wrapper.scrollTop > this.wrapper.scrollTopMax - 20)
      this.scrollPoles.add(Pole.South);
    else this.scrollPoles.delete(Pole.South);
    if (this.wrapper.scrollLeft > this.wrapper.scrollLeftMax - 20)
      this.scrollPoles.add(Pole.East);
    else this.scrollPoles.delete(Pole.East);
  }

  private moveGhost(pos: Vector) {
    const rec = this.overlay.getBoundingClientRect();
    this.ghostNode.ex = (pos[0] / this.overlayScale) - rec.left - rec.width / 2;
    this.ghostNode.ey = (pos[1] / this.overlayScale) - rec.top - rec.height / 2;
    this.changeDetector.detectChanges();
  }

  public beginRelation(parent: NodeComponent, pos: [number, number, Pole, boolean?]) {
    const rightClick = pos[3] || false;
    const pole = pos[2];
    if (this.autoMode && !rightClick) {
      this.createNewNode([
        pos[0],
        pos[1]
      ], [
        pos[0] + 100,
        pos[1]
      ], pos[2], Pole.West, parent.data.id);
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
    const childLevel = findLevelByNode(child.data, this.root, this.nodes, this.blueprint.relsArr);
    const parentLevel = findLevelByNode(this.allNodes.find(el => el.id == this.ghostNode.parent.id), this.root, this.nodes, this.blueprint.relsArr);
    if (childLevel > parentLevel) {
      this.socket.emit(Flags.CREATE_RELATION, new Relationship({
        parentId: this.ghostNode.parent.id,
        childId: child.data.id,
        blueprint: this.blueprint,
        parentPole: this.ghostNode.pole,
        // ex: anchorPos[0] + this.wrapper.scrollLeft,
        // ey: anchorPos[1] + this.wrapper.scrollTop - this.overlay.clientHeight / 2 - 48,
        // ox: this.ghostNode.ox,
        // oy: this.ghostNode.oy - this.overlay.clientHeight / 2
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
        this.rels.map(el => [el.parentId, el.childId, el.id])
      );
      for (const node of data.nodes)
        this.blueprint.nodesMap.delete(node);
      for (const rel of data.rels)
        this.blueprint.relsMap.delete(rel);
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
    // console.log(e.clientX + this.overlayTranslation.tx, e.clientY + this.overlayTranslation.ty);
    if (this.drawState === "moving") {
      e.stopImmediatePropagation();
      e.preventDefault();
      const zoom = this.overlayScale;
      this.transformMatrix = compose(
        this.transformMatrix,
        translate(e.movementX / zoom, e.movementY / zoom),
      );
      this.logger.log("Updating transform matrix", this.cssTransformMatrix);
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
  public onDragStart(node: Node, component: NodeComponent) {
    this.drawState = "dragging";
    this.movingNodeData = {
      node,
      nodeRect: component.wrapper.nativeElement.getBoundingClientRect(),
      childRels: findChildRels(node, this.blueprint.relsArr),
      parentRels: findParentRels(node, this.blueprint.relsArr),
    }
  }
  /**
   * Move all parent and child rel of a moving node
   * @param offset the moving offset
   * @param node the node that is moving
   */
  public onDragMove(offset: Vector): void {
    if (!this.movingNodeData)
      return;
    const { node, nodeRect, childRels, parentRels } = this.movingNodeData;
    const overlayRect = this.overlay.getBoundingClientRect();
    // Absolute position of the node 
    const x = offset[0] - (overlayRect.width / 2) / this.overlayScale - nodeRect.width / this.overlayScale;
    const y = offset[1] - (overlayRect.height / 2) / this.overlayScale + nodeRect.height / (2 * this.overlayScale);
    // dx,dy positions
    const dx = x - node.x;
    const dy = y - node.y;
    // for (const rel of parentRels) {
    //   rel.ex += dx;
    //   rel.ey += dy;
    // }
    // for (const rel of childRels) {
    //   rel.ox += dx;
    //   rel.oy += dy;
    // }
    node.x = x;
    node.y = y;
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
    this.movingNodeData = null;
  }

  /**
   * Detect if the mouse is in a Pole
   */
  private tresholdMouse(pos: Vector): Pole[] {
    const treshold = 48;
    const poles: Pole[] = [];
    if (pos[1] - 48 < treshold)
      poles.push(Pole.North);
    if (pos[1] > window.innerHeight - treshold)
      poles.push(Pole.South);
    if (pos[0] > this.wrapper.clientWidth - treshold)
      poles.push(Pole.East);
    if (pos[0] < treshold)
      poles.push(Pole.West);
    return poles;
  }

  /**
   * AddaptViewport to Mouse (increase viewport and scroll)
   */
  private adaptViewport(treshold: Pole[]) {
    if (treshold.includes(Pole.North) && this.wrapper.scrollTop > 10)
      this.wrapper.scrollBy({ top: - 10, behavior: 'auto' });
    if (treshold.includes(Pole.South) && this.wrapper.scrollTop + 20 < this.wrapper.scrollTopMax)
      this.wrapper.scrollBy({ top: 10, behavior: 'auto' });
    if (treshold.includes(Pole.East) && this.wrapper.scrollLeft + 20 < this.wrapper.scrollLeftMax)
      this.wrapper.scrollBy({ left: 10, behavior: 'auto' });
    if (treshold.includes(Pole.West) && this.wrapper.scrollLeft > 10)
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

    // We add width and height DOM values;
    for (const node of nodes) {
      const el = this.getNodeEl(node.id).wrapper.nativeElement;
      node.width = el.clientWidth;
      node.height = el.clientHeight;
    }
    const results: Node[] = await this.blueprintWorker.postAsyncMessage(`autopos-${this.tabId}`, [nodes, this.rels, margin, node]);
    if (!results) {
      this.snack.snack("Ouups ! Impossible d'agencer cet arbre");
      console.timeEnd("auto-pos");
      return;
    }
    for (const newNode of results)
      Object.assign(this.blueprint.nodesMap.get(newNode.id), newNode);
    console.timeEnd("auto-pos");
    this.progress.hide();
    for (const node of nodes)
      this.socket.emit(Flags.PLACE_NODE, new PlaceNodeOut(this.id, node.id, [node.x, node.y]));
    this.autoSizeViewport();
  }

  /**
   * Get a node element from the node id
   * TODO: Optimize this method
   * @param id the id of the node
   * @returns the node component
   */
  private getNodeEl(id: number): NodeComponent {
    return this.nodeEls.find(el => el.data.id === id) || (this.rootEl.data.id === id ? this.rootEl : null);
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


  get nodesMap(): Map<number, Node> {
    return this.blueprint.nodesMap;
  }
  get relsMap(): Map<number, Relationship> {
    return this.blueprint.relsMap;
  }
  get relIds(): number[] {
    return [...this.blueprint.relsMap.keys()];
  }
  get nodeIds(): number[] {
    return [...this.blueprint.nodesMap.keys()];
  }
  get blueprint(): BlueprintSock {
    return this.project.openBlueprints[this.tabId];
  }
  get root(): Node {
    return this.nodes.find(el => el.isRoot);
  }
  get nodes(): Node[] {
    return this.allNodes.filter(el => !el.isRoot);
  }
  get allNodes(): Node[] {
    return this.blueprint.nodesArr;
  }
  get rels(): Relationship[] {
    return this.blueprint.relsArr;
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
  pole: Pole
}
export interface MovingNodeData {
  node: Node;
  parentRels: Relationship[];
  childRels: Relationship[];
  nodeRect: DOMRect;
}