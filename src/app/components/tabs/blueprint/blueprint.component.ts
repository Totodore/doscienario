import { Vector } from './../../../../types/global.d';
import { ConfirmComponent } from './../../utils/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { BlueprintService } from './../../../services/blueprint.service';
import { ProgressService } from './../../../services/progress.service';
import { SocketService } from './../../../services/socket.service';
import { Blueprint, Node, RemoveNodeOut, Relationship } from './../../../models/sockets/blueprint-sock.model';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { ProjectService } from './../../../services/project.service';
import { Component, ViewChild, ElementRef, AfterViewChecked, ViewChildren, QueryList, OnInit } from '@angular/core';
import { v4 as uuid4 } from "uuid";
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Poles, NodeComponent } from './node/node.component';
import { findLevelByNode, findNodesByLevel, removeNodeFromTree } from 'src/app/utils/tree.utils';


@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent implements ITabElement, AfterViewChecked, OnInit {

  @ViewChild("viewport", { static: false })
  public canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild("wrapper", { static: false })
  public wrapper: ElementRef<HTMLDivElement>;

  @ViewChild("overlay", { static: false })
  public overlay: ElementRef<HTMLDListElement>;

  @ViewChild("rootEl", { static: false })
  public rootEl: NodeComponent;

  @ViewChildren("nodeEl")
  public nodeEls: QueryList<NodeComponent>;

  public initialized = false;
  public tabId: string;
  public show: boolean;
  public dragging = false;
  public magnetMode = false;
  public autoMode: boolean;
  public gridMode: boolean;

  public readonly type = TabTypes.BLUEPRINT;
  private scroll: Vector;

  constructor(
    private readonly dialog: MatDialog,
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly progress: ProgressService,
    public readonly blueprintHandler: BlueprintService
  ) { }

  ngOnInit() {
    this.autoMode = this.project.autoMode;
    this.gridMode = this.project.dispGrid;
  }

  ngAfterViewChecked() {
    if (this.canvas && this.tabId && !this.initialized) {
      this.blueprintHandler.init(this);
      this.initialized = true;
    }
  }

  onFocus() {
    if (this.initialized) {
      window.setTimeout(() => {
        this.blueprintHandler.init(this);
        this.wrapper.nativeElement.scrollTo({ left: this.scroll?.[0], top: this.scroll?.[1], behavior: "auto" });
      });
    }
  }
  onUnFocus() {
    this.scroll = [this.wrapper.nativeElement.scrollLeft, this.wrapper.nativeElement.scrollTop];
  }

  refreshView() {
    this.blueprintHandler.drawRelations();
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


  beginRelation(parent: NodeComponent, e: [number, number, boolean?]) {
    this.blueprintHandler.beginGhostRelation(parent, e);
  }
  bindRelation(child: NodeComponent, anchorPos: [number, number]) {
    const childLevel = findLevelByNode(child.data, this.root, this.nodes, this.blueprint.relationships);
    const parentLevel = findLevelByNode(this.blueprintHandler.parentGhost.data, this.root, this.nodes, this.blueprint.relationships);
    if (childLevel > parentLevel)
      this.blueprintHandler.bindRelation(child, anchorPos);
  }

  onRemove(el: NodeComponent) {
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
      this.blueprintHandler.drawRelations();
    });
  }

  onMouseDown(e: MouseEvent) {
    e.stopImmediatePropagation();
    e.preventDefault();
    this.dragging = true;
  }
  onMouseUp(e: MouseEvent) {
    this.dragging = false;
  }
  onMouseMove(e: MouseEvent) {
    if (this.dragging) {
      e.stopImmediatePropagation();
      e.preventDefault();
      this.wrapper.nativeElement.scrollTop -= e.movementY;
      this.wrapper.nativeElement.scrollLeft -= e.movementX;
    }
  }
  onWiden(pole: Poles) {
    this.blueprintHandler.widenViewport(pole);
    this.blueprintHandler.drawRelations();
  }

  public getNodeEl(id: number): NodeComponent {
    return this.nodeEls.find(el => el.data.id === id) || this.rootEl.data.id === id ? this.rootEl : null;
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

}
