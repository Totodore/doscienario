import { Node } from './../../../../models/sockets/blueprint-sock.model';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
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

  @ViewChild("wrapper", { static: false })
  public wrapper: ElementRef<HTMLDivElement>;

  @ViewChild("addRel", { static: false })
  public addRelBtn: ElementRef<HTMLSpanElement>;

  public btnAnchor: Poles = "north";
  public mouseHoverButton = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.addRelBtn.nativeElement.addEventListener("mouseenter", () => this.mouseHoverButton = true);
    this.addRelBtn.nativeElement.addEventListener("mouseleave", () => this.mouseHoverButton = false);
  }

  onAddRelButton(icon: MatIcon, e: Event) {
    e.stopImmediatePropagation();
    const rect = (icon._elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    this.relationBegin.emit([rect.x + rect.width / 2, rect.y + rect.height / 2]);
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
}
export type Poles = "north" | "east" | "south" | "west";
