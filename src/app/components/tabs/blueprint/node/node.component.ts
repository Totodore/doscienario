import { DrawStates } from './../blueprint.component';
import { ProgressService } from '../../../../services/ui/progress.service';
import { NodeEditorComponent } from './node-editor/node-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Vector } from './../../../../../types/global.d';
import { TabService } from './../../../../services/tab.service';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ProjectService } from 'src/app/services/project.service';
import { EditorWorkerService } from 'src/app/services/document-worker.service';
import { v4 } from 'uuid';
import { TreeSocketService } from 'src/app/services/sockets/tree-socket.service';
import { Change } from 'src/app/models/sockets/in/element.in';
import { Node } from 'src/app/models/api/blueprint.model';
import { EditSummaryOut } from 'src/app/models/sockets/out/blueprint.out';
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
  private readonly moveEnd = new EventEmitter<void>();

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
    private readonly socket: TreeSocketService,
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

  /**
   * We compute the position of the pole in the relative overlay
   */
  public onAddRelButton(icon: MatIcon, e: Event, rightClick = false) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const rels = this.project.getBlueprint(this.tabs.displayedTab[1].id).relationships.filter(el => el.childId === this.data.id);
    let [x, y] = [this.data.x, this.data.y];
    const [w, h] = [this.wrapper.nativeElement.clientWidth, this.wrapper.nativeElement.clientHeight];
    switch (this.btnAnchor) {
      case "north":
        y -= h / 2;
        x -= h / 2;
        break;
      case "south":
        y += h / 2;
        x += w / 2;
        break;
      case "east":
        x += w;
        break;
      case "west":
        break;
    }
    if (this.drawState === "drawing" && this.parentGhost !== this && !rels.find(el => el.parentId === this.parentGhost.data.id)) {
      this.relationBind.emit([x ,y]);
    } else {
      this.relationBegin.emit([x, y, this.btnAnchor, rightClick]);
    }
  }

  public onRemoveClick(e: Event) {
    e.stopImmediatePropagation();
    this.remove.emit();
  }
  public onChange(val: string) {
    this.socket.socket.emit(Flags.SUMARRY_NODE, new EditSummaryOut(this.data.id, val, this.blueprintId));
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
    // if (Math.abs(val.length - this.data.content?.length) > 500) {
    //   const change: Change = [2, null, val];
    //   this.socket.updateNode(this.data.id, this.tabId, [change], this.blueprintId);
    // } else {
    //   this.progressWatcher();
    //   this.editorWorker.worker.postMessage<Vector<string>>(`diff-${this.nodeUuid}`, [this.data.content || "", val]);
    // }
    // this.data.content = val;
  }

  private onContentDataResult(changes: Change[]) {
    // this.displayProgress = false;
    // this.progress.hide();
    // try {
    //   this.socket.updateNode(this.data.id, this.tabId, changes, this.blueprintId);
    // } catch (error) {   }
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
    this.move.emit([e.offsetX, e.offsetY]);
  }

  /**
   * Emit the last position
   */
  public onDragEnd(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.overlay.removeEventListener("mousemove", this.onMove);
    this.overlay.removeEventListener("mouseup", this.onUp);
    this.moveEnd.emit();
  }
}
export type Poles = "north" | "east" | "south" | "west";
