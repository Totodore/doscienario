import { Sheet } from './../../../../../models/api/sheet.model';
import { Component } from '@angular/core';
import { Document } from 'src/app/models/api/document.model';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from 'src/app/services/tab.service';
import { DocumentComponent } from 'src/app/components/tabs/document/document.component';
import { ContextMenuService } from 'src/app/services/ui/context-menu.service';

@Component({
  selector: 'app-document-sheet-list',
  templateUrl: './document-sheet-list.component.html',
  styleUrls: ['./document-sheet-list.component.scss']
})
export class DocumentSheetListComponent {

  constructor(
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    private readonly contextmenu: ContextMenuService,
  ) { }

  public onClick(sheet: Sheet) {
    this.docComponent.openSheet(sheet.id);
  }

  public onRightClick(e: MouseEvent, sheet: Sheet, existInDoc: boolean) {
    e.preventDefault();
    const options = [];
    if (existInDoc) {
      options.push({
        action: () => this.docComponent.scrollToSheet(sheet),
        label: "Scroller jusqu'à la note",
        icon: "keyboard_double_arrow_down"
      });
    }
    options.push({
      label: "Supprimer",
      color: "red",
      icon: "delete",
      action: () => this.docComponent.removeSheet(sheet)
    });
    this.contextmenu.show(e, options);
  }


  public get doc(): Document {
    return this.project.docs.find(el => el.id === this.docId);
  }
  public get docComponent(): DocumentComponent {
    return this.tabs.focusedTab as DocumentComponent;
  }
  public get docId(): number {
    return this.docComponent.id;
  }
  public get docTabId(): string {
    return this.docComponent.tabId;
  }

  //TODO: avoid heavy comp
  public get sheets() {
    return this.docComponent.getSortedSheets()[0];
  }
  public get notFoundSheets() {
    return this.docComponent.getSortedSheets()[1];
  }

}
