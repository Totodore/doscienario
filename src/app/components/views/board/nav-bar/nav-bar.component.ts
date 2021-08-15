import { SearchResults } from './../../../../models/api/project.model';
import { WelcomeTabComponent } from './../../../tabs/welcome-tab/welcome-tab.component';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from './../../../../services/tab.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TabTypes } from 'src/app/models/tab-element.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  public dispDocOptions: boolean = true;

  public searchQuery = "";

  constructor(
    public readonly tabs: TabService,
  ) { }

  get hasOpenedDoc(): boolean {
    return this.tabs.displayedTab?.[1]?.type === TabTypes.DOCUMENT;
  }

  get hasOpenedBlueprint(): boolean {
    return this.tabs.displayedTab?.[1]?.type === TabTypes.BLUEPRINT;
  }

}
