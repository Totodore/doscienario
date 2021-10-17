import { DataType, Element } from 'src/app/models/default.model';
import { Component, Input } from '@angular/core';
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
  public results!: Element[];

  public getIconName(el: Element): string {
    if (el.type === DataType.Blueprint)
      return "account_tree";
    else
      return "description";
  }

  public onClick(el: Element): void {
    if (el.type === DataType.Blueprint)
      this.tabs.pushTab(BlueprintComponent, true, el.id);
    else if (el.type === DataType.Document)
      this.tabs.pushTab(DocumentComponent, true, el.id);
  }
}
