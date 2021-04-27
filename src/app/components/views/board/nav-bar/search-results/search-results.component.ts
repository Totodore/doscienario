import { BlueprintComponent } from './../../../../tabs/blueprint/blueprint.component';
import { Blueprint } from './../../../../../models/sockets/blueprint-sock.model';
import { DocumentComponent } from '../../../../tabs/document/document.component';
import { TabService } from '../../../../../services/tab.service';
import { GetProjectDocumentRes, SearchResults } from '../../../../../models/api/project.model';
import { Tag } from '../../../../../models/sockets/tag-sock.model';
import { ProjectService } from '../../../../../services/project.service';
import { Component, Input, OnInit } from '@angular/core';
import { SearchQueryRes } from 'src/app/models/api/project.model';
import { DataType } from 'src/app/models/default.model';

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

  openEl(el: GetProjectDocumentRes | Tag | Blueprint) {
    console.log(el);
    if (el.type === DataType.Tag) {
      //TODO: TagView
    } else if (el.type === DataType.Blueprint)
      this.tabs.pushTab(BlueprintComponent, true, el.id);
    else if (el.type === DataType.Document)
      this.tabs.pushTab(DocumentComponent, true, el.id);
  }
  public getIconName(el: GetProjectDocumentRes | Blueprint | Tag): string {
    if (el.type === DataType.Blueprint)
      return "account_tree";
    else if (el.type === DataType.Tag)
      return "tag";
    else
      return "description";
  }
}
