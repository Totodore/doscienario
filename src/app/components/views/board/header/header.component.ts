import { ContextMenuService } from './../../../../services/ui/context-menu.service';
import { TabService } from '../../../../services/tab.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

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
    private readonly context: ContextMenuService
  ) { }

  public ngOnInit(): void {
    this.tabViewport = document.querySelector(".mat-tab-header");
    this.tabViewport.addEventListener("mouseenter", this.mouseEnter);
    this.tabViewport.addEventListener("mouseleave", this.mouseLeave);
  }

  public ngOnDestroy(): void {
    this.tabViewport.removeEventListener("mouseenter", this.mouseEnter);
    this.tabViewport.removeEventListener("mouseleave", this.mouseLeave);
  }


  public tabChanged(tabId?: string) {
    if (!tabId)
      return;
    this.tabService.showTab(tabId);
  }

  public tabClosed(tabId: string) {
    this.tabService.removeTab(tabId);
  }

  public tabRightClick(e: MouseEvent) {
    this.context.show(e, [{ label: "Fermer tous les onglets", action: () => this.tabService.closeAllTab(true) }]);
  }

}
