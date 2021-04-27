import { WorkerManager, WorkerType } from './../../../../../utils/worker-manager.utils';
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

  private searchWorker: WorkerManager;
  constructor(
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
  ) { }

  
  ngOnInit(): void {
    this.searchWorker = new WorkerManager(WorkerType.Search);
    this.project.updateSearch = () => this.search();
  }

  public async search() {
    if (!this.searchQuery || (this.searchQuery.length < 2 && this.searchQuery !== '*')) {
      this.results.emit(null);
      return;
    }
    this.progress.show();
    this.queryCount++;
    const data = await this.searchWorker.postAsyncMessage<SearchResults>('search', [this.searchQuery, [this.project.tags, this.project.docs, this.project.blueprints]]);
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
