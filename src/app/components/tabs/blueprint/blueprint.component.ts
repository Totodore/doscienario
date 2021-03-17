import { ITabElement } from './../../../models/tab-element.model';
import { ProjectService } from './../../../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Provider, Type, ViewEncapsulation } from '@angular/core';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent implements OnInit, ITabElement {

  @ViewChild("viewport")
  public canvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  public nodes: [
    {
      root: true,
    },
    {
      root: false,
      x: 256,
      y: 256
    }
  ]

  constructor(
    private readonly project: ProjectService
  ) { }

  title: string = "Blueprint";
  tabId?: string;
  docId?: number;
  show: boolean;
  openTab?: (id: string | number) => string;

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext("2d");
  }

  onDragNode(e: CdkDragMove<CdkDrag>) {
    const draggedNode = e.source.element.nativeElement;
  }

  drawCanvas() {
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo()
  }

}
