import { TabService } from './../../../../../services/tab.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-options',
  templateUrl: './document-options.component.html',
  styleUrls: ['./document-options.component.scss']
})
export class DocumentOptionsComponent {

  @Input() docIndex: number;

  constructor(
    public readonly tabs: TabService
  ) { }

  public collapse() {

  }

}
