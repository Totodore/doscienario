import { DrawStates } from './../blueprint.component';
import { ProgressService } from './../../../../services/progress.service';
import { NodeEditorComponent } from './node-editor/node-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { SocketService } from './../../../../services/socket.service';
import { Vector } from './../../../../../types/global.d';
import { TabService } from './../../../../services/tab.service';
import { Node, EditSumarryOut } from './../../../../models/sockets/blueprint-sock.model';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ProjectService } from 'src/app/services/project.service';
import { EditorWorkerService } from 'src/app/services/document-worker.service';
import { Change } from 'src/app/models/sockets/document-sock.model';
import { v4 } from 'uuid';
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit, OnInit {

  @Input()
  public data: Node;

  @Input()
  public blueprintId: number;

  @Input()
  public tabId: string;

  @Input()
  public parentGhost: NodeComponent;

  @Input()
  public drawState: DrawStates;

  @Input()
  public overlay: HTMLDivElement;

  @Output()
  private readonly relationBegin = new EventEmitter<[number, number, Poles, boolean?]>();

  @Output()
  private readonly relationBind = new EventEmitter<Vector>();

  @Output()
  private readonly remove = new EventEmitter<void>();

  @Output()
  private readonly moveStart = new EventEmitter<void>();

  @Output()
  private readonly move = new EventEmitter<Vector>();

  @Output()
  private readonly moveEnd = new EventEmitter<Vector>();

  /**
   * Named listeners in order to remove them and keep this inside function
   * @param e mouse event 
   */
  private onMove = (e: MouseEvent) => this.onDragMove(e);
  private onUp = (e: MouseEvent) => this.onDragEnd(e);

  @ViewChild("wrapper", { static: false })
  public wrapper: ElementRef<HTMLDivElement>;

  @ViewChild("addRel", { static: false })
  public addRelBtn: ElementRef<HTMLSpanElement>;

  public btnAnchor: Poles = "north";
  public mouseHoverButton = false;
  private initialized: boolean;
  private nodeUuid = v4();
  private displayProgress = false;


  constructor(
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    private readonly socket: SocketService,
    private readonly dialog: MatDialog,
    private readonly progress: ProgressService,
    private readonly editorWorker: EditorWorkerService,
  ) { }
  
  public ngOnInit() {
    this.editorWorker.worker.addEventListener<Change[]>(`diff-${this.nodeUuid}`, (data) => this.onContentDataResult(data));
  }

  public ngAfterViewInit(): void {
    if (!this.initialized) {
      this.addRelBtn.nativeElement.addEventListener("mouseenter", () => this.mouseHoverButton = true);
      this.addRelBtn.nativeElement.addEventListener("mouseleave", () => this.mouseHoverButton = false);
      this.initialized = true;
    }
  }

  public onAddRelButton(icon: MatIcon, e: Event, rightClick = false) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const rels = this.project.getBlueprint(this.tabs.displayedTab[1].id).relationships.filter(el => el.childId === this.data.id);
    const rect = (icon._elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    if (this.drawState === "drawing" && this.parentGhost !== this && !rels.find(el => el.parentId === this.parentGhost.data.id)) {
      this.relationBind.emit([rect.x + rect.width / 2, rect.y + rect.height / 2]);
    } else {
      this.relationBegin.emit([rect.x + rect.width / 2, rect.y + rect.height / 2, this.btnAnchor, rightClick]);
    }
  }

  public onRemoveClick(e: Event) {
    e.stopImmediatePropagation();
    this.remove.emit();
  }
  public onChange(val: string) {
    this.socket.socket.emit(Flags.SUMARRY_NODE, new EditSumarryOut(this.data.id, val, this.blueprintId));
  }

  public openDetailsView() {
    const dialog = this.dialog.open(NodeEditorComponent, {
      closeOnNavigation: false,
      height: "90%",
      width: "80%",
      maxWidth: "100%",
      id: "editor-dialog",
      data: this.data.content
    });
    dialog.componentInstance.onChange.subscribe((e: string) => {
      this.onContentData(e);
    }, null, () => dialog.close());
  }

  public async onContentData(val: string) {
    if (Math.abs(val.length - this.data.content?.length) > 500) {
      const change: Change = [2, null, val];
      this.socket.updateNode(this.data.id, this.tabId, [change], this.blueprintId);
    } else {
      this.progressWatcher();
      this.editorWorker.worker.postMessage<Vector<string>>(`diff-${this.nodeUuid}`, [this.data.content || "", val]);
    }
    this.data.content = val;
  }

  private onContentDataResult(changes: Change[]) {
    this.displayProgress = false;
    this.progress.hide();
    try {
      this.socket.updateNode(this.data.id, this.tabId, changes, this.blueprintId);
    } catch (error) {   }
  }

  private progressWatcher() {
    this.displayProgress = true;
    setTimeout(() => this.displayProgress && this.progress.show(), 1000);
  }

  @HostListener("mousemove", ['$event'])
  public onMoveHover(e: MouseEvent) {
    if (this.mouseHoverButton) return;
    const [w, h] = [this.wrapper.nativeElement.parentElement.clientWidth, this.wrapper.nativeElement.parentElement.clientHeight];
    if (e.offsetX < w / 4 && !this.data?.isRoot)
      this.btnAnchor = "west";
    else if (e.offsetX > (3 * w) / 4)
      this.btnAnchor = "east";
    else if (e.offsetY > h / 2)
      this.btnAnchor = "south";
    else if (e.offsetY < h / 2)
      this.btnAnchor = "north";
  }

  public onDragStart(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.overlay.addEventListener("mousemove", this.onMove);
    this.overlay.addEventListener("mouseup", this.onUp);
    this.moveStart.emit();
  }

  /**
   * Emit the distance between the origin and the drag
   */
  public onDragMove(e: MouseEvent) {
    let x = Math.min(
      Math.max(e.offsetX - this.wrapper.nativeElement.parentElement.clientWidth, 48),
      this.overlay.clientWidth - this.wrapper.nativeElement.clientWidth
    );
    let y = Math.min(
      e.offsetY + (this.wrapper.nativeElement.parentElement.clientHeight / 2),
      this.overlay.clientHeight - this.wrapper.nativeElement.clientHeight
    ) - this.overlay.clientHeight / 2;
    this.move.emit([this.data.x - x, this.data.y - y]);
  }

  /**
   * Emit the last position
   */
  public onDragEnd(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const x = Math.min(e.offsetX - this.wrapper.nativeElement.parentElement.clientWidth, this.overlay.clientWidth);
    const y = e.offsetY + (this.wrapper.nativeElement.parentElement.clientHeight / 2) - this.overlay.clientHeight / 2;
    const delta: Vector = [this.data.x - x, this.data.y - y];
    this.overlay.removeEventListener("mousemove", this.onMove);
    this.overlay.removeEventListener("mouseup", this.onUp);
    this.moveEnd.emit(delta);
  }
}
export type Poles = "north" | "east" | "south" | "west";
