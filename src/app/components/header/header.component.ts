import { TabService } from './../../services/tab.service';
import { ApiService } from './../../services/api.service';
import { ProgressService } from './../../services/progress.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public readonly progress: ProgressService,
    public readonly tabService: TabService,
  ) { }

  public tabChanged(index: number) {
    this.tabService.showTab(index);
  }

  public tabClosed(index: number) {
    this.tabService.removeTab(index);
  }

}
