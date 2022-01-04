
import { TabService } from './../../../../services/tab.service';
import { Component } from '@angular/core';
import { TabTypes } from 'src/app/models/sys/tab.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  public dispDocOptions: boolean = true;

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
