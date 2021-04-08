import { Node } from './../../../../models/sockets/blueprint-sock.model';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Y } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit {

  @Input()
  public data: Node;

  @Output()
  private readonly relationBegin = new EventEmitter<[number, number]>();

  @Output()
  private readonly dragStart = new EventEmitter<[number, number]>();

  @Output()
  private readonly dragEnd = new EventEmitter<[number, number]>();

  @Output()
  private readonly dragMove = new EventEmitter<[number, number]>();

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

  private viewport: HTMLElement;
  private initialized: boolean;
  private dragOrigin: [number, number];

  constructor() { }

  ngAfterViewInit(): void {
    if (!this.initialized) {
      this.viewport = document.querySelector("app-blueprint > .wrapper");
      this.addRelBtn.nativeElement.addEventListener("mouseenter", () => this.mouseHoverButton = true);
      this.addRelBtn.nativeElement.addEventListener("mouseleave", () => this.mouseHoverButton = false);
      this.initialized = true;
    }
  }

  onAddRelButton(icon: MatIcon, e: Event) {
    e.stopImmediatePropagation();
    const rect = (icon._elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    this.relationBegin.emit([rect.x + rect.width / 2, rect.y + rect.height / 2]);
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
    this.dragOrigin = [
      Math.min(e.x + this.viewport.scrollLeft - this.wrapper.nativeElement.parentElement.clientWidth),
      Math.min(e.y + this.viewport.scrollTop - 48 + (this.wrapper.nativeElement.parentElement.clientHeight / 2)),
    ];
    window.addEventListener("mousemove", this.onMove);
    window.addEventListener("mouseup", this.onUp);
    this.dragStart.emit(this.dragOrigin);
  }

  /**
   * Emit the distance between the origin and the drag
   */
  onDragMove(e: MouseEvent) {
    const x = Math.min(e.x + this.viewport.scrollLeft - this.wrapper.nativeElement.parentElement.clientWidth);
    const y = Math.min(e.y + this.viewport.scrollTop - 48 + (this.wrapper.nativeElement.parentElement.clientHeight / 2));
    this.wrapper.nativeElement.parentElement.style.left = x + "px";
    this.wrapper.nativeElement.parentElement.style.top = y + "px";
    this.dragMove.emit([this.dragOrigin[0] - x, this.dragOrigin[1] - y]);
  }

  /**
   * Emit the last position
   */
  onDragEnd(e: MouseEvent) {
    const x = Math.min(e.x + this.viewport.scrollLeft - this.wrapper.nativeElement.parentElement.clientWidth);
    const y = Math.min(e.y + this.viewport.scrollTop - 48 + (this.wrapper.nativeElement.parentElement.clientHeight / 2));
    window.removeEventListener("mousemove", this.onMove);
    window.removeEventListener("mouseup", this.onUp);
    this.dragEnd.emit([this.dragOrigin[0] - x, this.dragOrigin[1] - y]);
    this.dragOrigin = null;
  }
}
export type Poles = "north" | "east" | "south" | "west";
