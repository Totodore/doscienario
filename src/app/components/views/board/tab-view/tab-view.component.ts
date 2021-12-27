
import { TabService } from '../../../../services/tab.service';
import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
})
export class TabViewComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(
    public readonly tab: TabService,
  ) { }

  /**
   * We use SetTimeout to avoid angular lifecycle error
   */
  ngAfterViewInit(): void {
    this.tab.setRootViewContainerRef(this.container);
  }
}
