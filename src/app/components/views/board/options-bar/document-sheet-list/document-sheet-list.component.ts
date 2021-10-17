import { Sheet } from './../../../../../models/api/sheet.model';
import { Component, OnInit } from '@angular/core';
import { DocumentSock } from 'src/app/models/api/document.model';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from 'src/app/services/tab.service';
import { DocumentComponent } from 'src/app/components/tabs/document/document.component';

@Component({
  selector: 'app-document-sheet-list',
  templateUrl: './document-sheet-list.component.html',
  styleUrls: ['./document-sheet-list.component.scss']
})
export class DocumentSheetListComponent {

  constructor(
    private readonly project: ProjectService,
    private readonly tabs: TabService,
  ) { }

  public onClick(sheet: Sheet) {
    
  }

  public onRightClick(e: Event, sheet: Sheet) {
    e.preventDefault();
    this.docComponent.scrollToSheet(sheet);
  }

  
  public get doc(): DocumentSock {
    return this.project.openDocs[this.docTabId];
  }
  public get docComponent(): DocumentComponent {
    return this.tabs.displayedTab[1] as DocumentComponent;
  }
  public get docId(): number {
    return this.docComponent.id;
  }
  public get docTabId(): string {
    return this.docComponent.tabId;
  }
  public get sheets() {
    return this.doc.sheets;
  }

}
