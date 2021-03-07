import { GetProjectDocumentRes, SearchResults } from './../../../../../../models/api/project.model';
import { Tag } from './../../../../../../models/sockets/tag-sock.model';
import { ProjectService } from './../../../../../../services/project.service';
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
    public projectManager: ProjectService
  ) { }

  openEl(el: GetProjectDocumentRes | Tag) {

  }
}
