import { Component } from '@angular/core';
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
  ) {}
}
