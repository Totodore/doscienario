import { DocumentComponent } from './../../../../tabs/document/document.component';
import { TabService } from './../../../../../services/tab.service';
import { Component, Input } from '@angular/core';
import { WelcomeTabComponent } from 'src/app/components/tabs/welcome-tab/welcome-tab.component';

@Component({
    selector: 'app-add-options',
    templateUrl: './add-options.component.html',
    styleUrls: ['./add-options.component.scss']
})
export class AddOptionsComponent {
  constructor(
    private readonly tabs: TabService
  ) { }

  createDoc() {
    this.tabs.pushTab(DocumentComponent, false, null, true);
  }

  public openMenu() {
    this.tabs.pushTab(WelcomeTabComponent);
  }
}
