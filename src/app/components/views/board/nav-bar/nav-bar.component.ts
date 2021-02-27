import { TabService } from './../../../../services/tab.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  public dispDocOptions: boolean = true;
  constructor(
    public readonly tabs: TabService
  ) { }

  get hasOpenedTab(): boolean {
    return this.tabs.displayedTab != null;
  }

}
