import { WelcomeTabComponent } from './../../../tabs/welcome-tab/welcome-tab.component';
import { ProjectService } from 'src/app/services/project.service';
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
    public readonly tabs: TabService,
    private readonly project: ProjectService
  ) { }

  public openMenu() {
    this.tabs.pushTab(WelcomeTabComponent);
  }

  get hasOpenedTab(): boolean {
    return this.tabs.displayedTab != null && this.project.openDocs[this.tabs.displayedTab[1].tabId] != null;
  }

}
