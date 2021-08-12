import { DocumentComponent } from './components/tabs/document/document.component';
import { TabService } from './services/tab.service';
import { N, T, W } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ProgressService } from './services/progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(
    public readonly progress: ProgressService,
    private readonly changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.progress.changeDetector = this.changeDetector;
  }
}
