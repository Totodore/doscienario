import { Sheet } from './../../../../../models/api/sheet.model';
import { Component, OnInit } from '@angular/core';
import { Document, DocumentSock } from 'src/app/models/api/document.model';
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
    this.docComponent.openSheet(sheet.id);
  }

  public onRightClick(e: Event, sheet: Sheet) {
    e.preventDefault();
    this.docComponent.scrollToSheet(sheet);
  }

  
  public get doc(): Document {
    return this.project.docs.find(el => el.id === this.docId);
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
    return this.docComponent.getSortedSheets()[0];
  }
  public get notFoundSheets() {
    return this.docComponent.getSortedSheets()[1];
  }

}
