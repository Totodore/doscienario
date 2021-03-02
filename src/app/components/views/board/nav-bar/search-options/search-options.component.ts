import { DocumentComponent } from './../../../../tabs/document/document.component';
import { AskInputComponent } from './../../../../utils/ask-input/ask-input.component';
import { TabService } from './../../../../../services/tab.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent {

  constructor(
    private readonly tabs: TabService
  ) { }

  ngOnInit() {
  }
  public createDoc() {
    this.tabs.pushTab(DocumentComponent, false);
  }

}
