import { DocumentComponent } from './components/tabs/document/document.component';
import { TabService } from './services/tab.service';
import { T, W } from '@angular/cdk/keycodes';
import { Component, HostListener } from '@angular/core';
import { ProgressService } from './services/progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'doscienario';

  constructor(
    public readonly progress: ProgressService,
    public readonly tabs: TabService
  ) { }

  @HostListener('keydown', ['$event'])
  public onCtrlKeyDown(e: KeyboardEvent) {
    if (!e.ctrlKey)
      return;
    switch (e.keyCode) {
      case W:
        this.tabs.removeTab();
        break;
      case T:
        this.tabs.pushTab(DocumentComponent, false, null, true);
      default:
        break;
    }
  }
}
