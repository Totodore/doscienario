import { WorkerManagerService } from './../../../../../services/worker-manager.service';
import { SnackbarService } from './../../../../../services/snackbar.service';
import { ProgressService } from 'src/app/services/progress.service';
import { GetProjectDocumentRes, SearchQueryRes, SearchResults } from './../../../../../models/api/project.model';
import { ProjectService } from './../../../../../services/project.service';
import { ApiService } from './../../../../../services/api.service';
import { Flags } from './../../../../../models/sockets/flags.enum';
import { SocketService } from './../../../../../services/socket.service';
import { DocumentComponent } from './../../../../tabs/document/document.component';
import { TabService } from './../../../../../services/tab.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {

  public searchQuery: string;
  public queryCount = 0;
  public sortState: ("doc" | "tag")[] = ["doc", "tag"];

  public results: SearchResults;

  constructor(
    private readonly tabs: TabService,
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
    private readonly workerManager: WorkerManagerService
  ) { }
  ngOnInit(): void {
    this.workerManager.addEventListener('search', (data: SearchResults) => this.onSearch(data));
  }

  public createDoc() {
    this.tabs.pushTab(DocumentComponent, false);
  }

  public async search() {
    if (this.searchQuery.length < 2) {
      this.results = null;
      return;
    }
    this.progress.show();
    this.queryCount++;
    this.workerManager.postMessage('search', [this.searchQuery, [this.project.tags, this.project.docs]]);
  }

  public onSearch(data: SearchResults) {
    this.results = data;
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
