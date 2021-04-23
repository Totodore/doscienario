import { Vector } from './../../../../../types/global.d';
import { TabService } from './../../../../services/tab.service';
import { BlueprintService } from './../../../../services/blueprint.service';
import { Node } from './../../../../models/sockets/blueprint-sock.model';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Y } from '@angular/cdk/keycodes';
import { ProjectService } from 'src/app/services/project.service';
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit {

  @Input()
  public data: Node;

  @Output()
  private readonly relationBegin = new EventEmitter<[number, number, boolean?]>();

  @Output()
  private readonly relationBind = new EventEmitter<Vector>();

  @Output()
  private readonly remove = new EventEmitter<void>();

  private onMove = (e: MouseEvent) => this.onDragMove(e);
  private onUp = (e: MouseEvent) => this.onDragEnd(e);

  @ViewChild("wrapper", { static: false })
  public wrapper: ElementRef<HTMLDivElement>;

  @ViewChild("addRel", { static: false })
  public addRelBtn: ElementRef<HTMLSpanElement>;

  public btnAnchor: Poles = "north";
  public mouseHoverButton = false;
  private initialized: boolean;


  constructor(
    private readonly blueprintHandler: BlueprintService,
    private readonly project: ProjectService,
    private readonly tabs: TabService
  ) { }

  ngAfterViewInit(): void {
    if (!this.initialized) {
      this.addRelBtn.nativeElement.addEventListener("mouseenter", () => this.mouseHoverButton = true);
      this.addRelBtn.nativeElement.addEventListener("mouseleave", () => this.mouseHoverButton = false);
      this.initialized = true;
    }
  }

  onAddRelButton(icon: MatIcon, e: Event, rightClick = false) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const rels = this.project.getBlueprint(this.tabs.displayedTab[1].id).relationships.filter(el => el.childId === this.data.id);
    const rect = (icon._elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    if (this.blueprintHandler.drawState === "drawing" && this.blueprintHandler.parentGhost !== this && !rels.find(el => el.parentId === this.blueprintHandler.parentGhost.data.id)) {
      this.relationBind.emit([rect.x + rect.width / 2, rect.y + rect.height / 2]);
    } else {
      this.relationBegin.emit([rect.x + rect.width / 2, rect.y + rect.height / 2, rightClick]);
    }
  }

  onRemoveClick(e: Event) {
    e.stopImmediatePropagation();
    this.remove.emit();
  }

  @HostListener("mousemove", ['$event'])
  onMoveHover(e: MouseEvent) {
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

  onDragStart(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.blueprintHandler.overlay.addEventListener("mousemove", this.onMove);
    this.blueprintHandler.overlay.addEventListener("mouseup", this.onUp);
    this.blueprintHandler.onDragStart();
  }

  /**
   * Emit the distance between the origin and the drag
   */
  onDragMove(e: MouseEvent) {
    let x = Math.min(
      Math.max(e.offsetX - this.wrapper.nativeElement.parentElement.clientWidth, 48),
      this.blueprintHandler.overlay.clientWidth - this.wrapper.nativeElement.clientWidth
    );
    let y = Math.min(
      e.offsetY + (this.wrapper.nativeElement.parentElement.clientHeight / 2),
      this.blueprintHandler.overlay.clientHeight - this.wrapper.nativeElement.clientHeight
    ) - this.blueprintHandler.overlay.clientHeight / 2;
    const delta: Vector = [this.data.x - x, this.data.y - y];
    this.blueprintHandler.nodeMagnetMove(delta, this.data);
    this.blueprintHandler.onDragMove(delta, this.data);
  }

  /**
   * Emit the last position
   */
  onDragEnd(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const x = Math.min(e.offsetX - this.wrapper.nativeElement.parentElement.clientWidth, this.blueprintHandler.overlay.clientWidth);
    const y = e.offsetY + (this.wrapper.nativeElement.parentElement.clientHeight / 2) - this.blueprintHandler.overlay.clientHeight / 2;
    const delta: Vector = [this.data.x - x, this.data.y - y];
    this.blueprintHandler.overlay.removeEventListener("mousemove", this.onMove);
    this.blueprintHandler.overlay.removeEventListener("mouseup", this.onUp);
    this.blueprintHandler.onDragEnd(this.data, delta);
  }
}
export type Poles = "north" | "east" | "south" | "west";
