import { WorkerManager, WorkerType } from './../../../../../utils/worker-manager.utils';
import { ProgressService } from 'src/app/services/progress.service';
import { SearchResults } from './../../../../../models/api/project.model';
import { ProjectService } from './../../../../../services/project.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent {

  @Output()
  public readonly needleChange = new EventEmitter<string>();

  @Input()
  public needle = "";
}
