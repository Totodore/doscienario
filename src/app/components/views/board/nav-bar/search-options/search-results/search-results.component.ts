import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {

  private _results: string;

  @Input()
  public set results(value: string | undefined) {
    this._results = value || '';
  }

  public get results(): string {
    return this._results;
  }
}
