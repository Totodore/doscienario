import { WorkerManagerService } from './../../../../../services/worker-manager.service';
import { ProgressService } from 'src/app/services/progress.service';
import { SearchResults } from './../../../../../models/api/project.model';
import { ProjectService } from './../../../../../services/project.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {

  public searchQuery: string;
  public queryCount = 0;
  public sortState: ("doc" | "tag")[] = ["doc", "tag"];

  @Output() public results: EventEmitter<SearchResults> = new EventEmitter<SearchResults>();

  constructor(
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
    private readonly workerManager: WorkerManagerService
  ) { }
  ngOnInit(): void {
    this.workerManager.addEventListener('search', (data: SearchResults) => this.onSearch(data));
  }

  public async search() {
    if (this.searchQuery.length < 2 && this.searchQuery !== '*') {
      this.results.emit(null);
      return;
    }
    this.progress.show();
    this.queryCount++;
    this.workerManager.postMessage('search', [this.searchQuery, [this.project.tags, this.project.docs]]);
  }

  public onSearch(data: SearchResults) {
    this.results.emit(data);
    this.queryCount--;
    if (this.queryCount == 0)
      this.progress.hide();
  }
  public onChipClick(state: "doc" | "tag") {
    if (this.sortState.includes(state))
      this.sortState.splice(this.sortState.indexOf(state), 1);
    else this.sortState.push(state);
  }
}
