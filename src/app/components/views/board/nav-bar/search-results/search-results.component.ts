import { DocumentComponent } from '../../../../tabs/document/document.component';
import { TabService } from '../../../../../services/tab.service';
import { GetProjectDocumentRes, SearchResults } from '../../../../../models/api/project.model';
import { Tag } from '../../../../../models/sockets/tag-sock.model';
import { ProjectService } from '../../../../../services/project.service';
import { Component, Input, OnInit } from '@angular/core';
import { SearchQueryRes } from 'src/app/models/api/project.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {

  @Input() results: SearchResults;

  dispTagResults: boolean = true;
  dispDocResults: boolean = true;

  constructor(
    private readonly tabs: TabService
  ) { }

  openEl(el: GetProjectDocumentRes | Tag) {
    console.log(el);
    if ((el as Tag).name) {
      //TODO: TagView
    } else this.tabs.pushTab(DocumentComponent, false, el.id);
  }
}
