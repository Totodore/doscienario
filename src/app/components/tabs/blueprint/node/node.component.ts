import { ContextMenuService } from './../../../../services/ui/context-menu.service';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Bounds, Node, Pole } from 'src/app/models/api/blueprint.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Change } from 'src/app/models/sockets/in/element.in';
import { EditSummaryOut } from 'src/app/models/sockets/out/blueprint.out';
import { EditorWorkerService } from 'src/app/services/document-worker.service';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { v4 } from 'uuid';
import { ProgressService } from '../../../../services/ui/progress.service';
import { Vector } from './../../../../../types/global.d';
import { TabService } from './../../../../services/tab.service';
import { DrawStates } from './../blueprint.component';
import { NodeEditorComponent } from './node-editor/node-editor.component';
import { findChildRels } from 'src/app/utils/tree.utils';
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

  @Input()
  public readonly freeMode = false;

  @Output()
  private readonly relationBegin = new EventEmitter<[number, number, Pole, boolean?]>();

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

  @Output()
  private readonly resize = new EventEmitter<[number, number]>();

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

  @ViewChild("textarea", { static: false })
  public textarea: ElementRef<HTMLTextAreaElement>;

  public btnAnchor: Pole = Pole.East;
  public mouseHoverButton = false;
  private initialized: boolean;
  private nodeUuid = v4();
  private displayProgress = false;
  private previousBounds?: Bounds;


  constructor(
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    private readonly socket: SocketService,
    private readonly dialog: MatDialog,
    private readonly progress: ProgressService,
    private readonly editorWorker: EditorWorkerService,
    private readonly contextMenu: ContextMenuService
  ) { }

  public ngOnInit() {
    this.editorWorker.worker.addEventListener<Change[]>(`diff-${this.nodeUuid}`, (data) => this.onContentDataResult(data));
  }

  public ngAfterViewInit(): void {
    if (!this.initialized) {
      this.addRelBtn?.nativeElement.addEventListener("mouseenter", () => this.mouseHoverButton = true);
      this.addRelBtn?.nativeElement.addEventListener("mouseleave", () => this.mouseHoverButton = false);
      this.wrapper.nativeElement.addEventListener("contextmenu", e => this.onContextMenu(e));
      this.initialized = true;
    }
    if (this.data) {
      this.data.height = this.wrapper.nativeElement.clientHeight;
      this.data.width = this.wrapper.nativeElement.clientWidth;
    }
  }

  public onContextMenu(e: MouseEvent) {
    e.preventDefault();
    this.contextMenu.show(e, [
      {
        icon: "delete",
        color: "red",
        label: "Supprimer",
        action: () => this.onRemoveClick(e)
      }
    ]);
  }

  /**
   * We compute the position of the pole in the relative overlay
   */
  public onAddRelButton(icon: MatIcon, e: Event, rightClick = false) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const rels = this.project.getBlueprint(this.tabs.displayedTab[1].id).relsArr;
    let [x, y] = [this.data.x, this.data.y];
    const [w, h] = [this.wrapper.nativeElement.clientWidth, this.wrapper.nativeElement.clientHeight];
    switch (this.btnAnchor) {
      case Pole.North:
        y -= h / 2;
        x += w / 2;
        break;
      case Pole.South:
        y += h / 2;
        x += w / 2;
        break;
      case Pole.East:
        x += w;
        break;
      case Pole.West:
        break;
    }
    if (this.drawState === "drawing" && this.parentGhost !== this && !rels.find(el => el.parentId === this.parentGhost.data.id)) {
      this.relationBind.emit([x, y]);
    } else {
      if (!rightClick || findChildRels(this.data, rels).length == 0)
        this.relationBegin.emit([x, y, this.btnAnchor, rightClick]);
    }
  }

  public onRemoveClick(e: Event) {
    e.stopImmediatePropagation();
    this.remove.emit();
  }
  public onChange(val: string) {
    this.socket.emit(Flags.SUMARRY_NODE, new EditSummaryOut(this.data.id, val, this.blueprintId));
    setTimeout(() => {
      if (this.bounds.height != this.previousBounds?.height) {
        this.resize.emit([this.bounds.width - this.previousBounds?.width || 0, this.bounds.height - this.previousBounds?.height || 0]);
        this.previousBounds = this.bounds;
      }
    }, 0);
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

  public onTextInput(e: KeyboardEvent) {
    if (e.key === "Tab") {
      const index = this.textarea.nativeElement.selectionStart;
      this.textarea.nativeElement.value = this.textarea.nativeElement.value.substring(0, index) + "\t" + this.textarea.nativeElement.value.substring(index);
      this.textarea.nativeElement.selectionStart = this.textarea.nativeElement.selectionEnd = index + 1;
      e.preventDefault();
    }
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

  // @HostListener("mousemove", ['$event'])
  public onMoveHover(e: MouseEvent) {
    if (this.mouseHoverButton || !this.addRelBtn) return;
    const [w, h] = [this.wrapper.nativeElement.parentElement.clientWidth, this.wrapper.nativeElement.parentElement.clientHeight];
    if (e.offsetX < w / 4 && !this.data?.isRoot)
      this.btnAnchor = Pole.West;
    else if (e.offsetX > (3 * w) / 4)
      this.btnAnchor = Pole.East;
    else if (e.offsetY > h / 2)
      this.btnAnchor = Pole.South;
    else if (e.offsetY < h / 2)
      this.btnAnchor = Pole.North;
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

  public get hasAnchor(): boolean {
    return !!this.project.getBlueprint(this.tabs.displayedTab[1].id).loopbackRelsArr.find(el => el.parentId == this.data.id);
  }
  public get bounds(): Bounds {
    return {
      x: this.data.x,
      y: this.data.y,
      width: this.wrapper?.nativeElement?.clientWidth || this.data.width,
      height: this.wrapper?.nativeElement?.clientHeight || this.data.height
    }
  }
}