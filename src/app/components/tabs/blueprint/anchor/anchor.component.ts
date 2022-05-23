import { BlueprintComponent } from 'src/app/components/tabs/blueprint/blueprint.component';
import { Relationship } from './../../../../models/api/blueprint.model';
import { Component, Input, OnInit, HostListener, ElementRef } from '@angular/core';
import { Node } from 'src/app/models/api/blueprint.model';

@Component({
  selector: 'g[anchor]',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss']
})
export class AnchorComponent {

  @Input()
  public parentNode: Node;

  @Input()
  public childNode: Node;

  @Input()
  public data: Relationship;

  @Input()
  public overlay: HTMLDivElement;

  @Input()
  public blueprintRef: BlueprintComponent;

  constructor() { }

  @HostListener("click")
  public onClick() {
    console.log("test");
    const childNodeWrapper = this.blueprintRef.getNodeEl(this.childNode.id).wrapper.nativeElement;
    console.log(childNodeWrapper);
    if (childNodeWrapper.classList.contains("flash-animated")) {
      // Reflow hack to restart animation https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
      childNodeWrapper.style.animation = "none";
      childNodeWrapper.offsetHeight;
      childNodeWrapper.style.animation = null;
    } else
      childNodeWrapper.classList.add("flash-animated");
  } 

  public get x(): number {
    return this.parentNode.x + this.parentNode.bounds.width + this.overlay.clientWidth / 2;
  }

  public get y(): number {
    return this.parentNode.y + this.overlay.clientHeight / 2;
  }

  public get color(): string {
    return '#' + (this.parentNode.color || "FFF");
  }
}
