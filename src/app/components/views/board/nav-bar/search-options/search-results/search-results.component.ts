import { DataType, ElementModel } from 'src/app/models/default.model';
import { Component, Input, OnInit } from '@angular/core';
import { Blueprint } from 'src/app/models/sockets/blueprint-sock.model';
import { TabService } from 'src/app/services/tab.service';
import { BlueprintComponent } from 'src/app/components/tabs/blueprint/blueprint.component';
import { DocumentComponent } from 'src/app/components/tabs/document/document.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {

  constructor(private readonly tabs: TabService) { }

  @Input()
  public results!: ElementModel[];

  public getIconName(el: ElementModel): string {
    if (el.type === DataType.Blueprint)
      return "account_tree";
    else
      return "description";
  }

  public onClick(el: ElementModel): void {
    if (el.type === DataType.Blueprint)
      this.tabs.pushTab(BlueprintComponent, true, el.id);
    else if (el.type === DataType.Document)
      this.tabs.pushTab(DocumentComponent, true, el.id);
  }
}
