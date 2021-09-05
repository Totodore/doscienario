import { DataType, ElementModel } from 'src/app/models/default.model';
import { Component, Input, OnInit } from '@angular/core';
import { Blueprint } from 'src/app/models/sockets/blueprint-sock.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {

  @Input()
  public results!: ElementModel[];

  public getIconName(el: ElementModel): string {
    if ((el as Blueprint).type === DataType.Blueprint)
      return "account_tree";
    else
      return "description";
  }

  public onClick(el: ElementModel): void {
    console.log(el);
  }
}
