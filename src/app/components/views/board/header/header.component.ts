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

  constructor(
    public readonly progress: ProgressService,
    public readonly tabService: TabService,
  ) { }

  ngOnInit(): void {
    this.tabViewport = document.querySelector(".mat-tab-label-container");
    window.addEventListener('wheel', this.wheelAction);
  }

  ngOnDestroy(): void {
    window.removeEventListener('wheel', this.wheelAction);
  }


  public tabChanged(index: number) {
    this.tabService.showTab(index);
  }

  public tabClosed(index: number) {
    this.tabService.removeTab(index);
  }

}
