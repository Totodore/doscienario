import { TabService } from '../../../../services/tab.service';
import { ApiService } from '../../../../services/api.service';
import { ProgressService } from '../../../../services/progress.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private tabViewport: HTMLDivElement;
  private wheelAction: (e: WheelEvent) => void = (e) => this.tabViewport.scrollLeft += e.deltaY;
  private mouseEnter: () => void = () => window.addEventListener('wheel', this.wheelAction);
  private mouseLeave: () => void = () => window.removeEventListener('wheel', this.wheelAction);

  constructor(
    public readonly tabService: TabService,
  ) { }

  ngOnInit(): void {
    this.tabViewport = document.querySelector(".mat-tab-label-container");
    this.tabViewport.addEventListener("mouseenter", this.mouseEnter);
    this.tabViewport.addEventListener("mouseleave", this.mouseLeave);
  }

  ngOnDestroy(): void {
    this.tabViewport.removeEventListener("mouseenter", this.mouseEnter);
    this.tabViewport.removeEventListener("mouseleave", this.mouseLeave);
  }


  public tabChanged(index: number) {
    this.tabService.showTab(index);
  }

  public tabClosed(index: number) {
    this.tabService.removeTab(index);
  }

}
