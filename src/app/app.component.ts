import { DocumentComponent } from './components/tabs/document/document.component';
import { TabService } from './services/tab.service';
import { N, T, W } from '@angular/cdk/keycodes';
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
  ) { }
}
