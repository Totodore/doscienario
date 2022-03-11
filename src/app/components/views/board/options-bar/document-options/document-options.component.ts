import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTagsComponent } from 'src/app/components/modals/edit-tags/edit-tags.component';
import { DocumentSock } from 'src/app/models/api/document.model';
import { Tag } from 'src/app/models/api/tag.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { RenameElementOut } from 'src/app/models/sockets/out/element.out';
import { TabTypes } from 'src/app/models/sys/tab.model';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { ColorElementOut } from './../../../../../models/sockets/out/element.out';
import { TabService } from './../../../../../services/tab.service';
import { ConfirmComponent } from './../../../../utils/confirm/confirm.component';

@Component({
  selector: 'app-document-options',
  templateUrl: './document-options.component.html',
  styleUrls: ['./document-options.component.scss']
})
export class DocumentOptionsComponent {

  constructor(
    private readonly tabs: TabService,
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly dialog: MatDialog
  ) { }

  public onRename(title: string) {
    this.doc.title = title.length > 0 ? title : "Nouveau document";
    this.project.renameDoc(this.tabId, this.doc.title);
    this.socket.emit(Flags.RENAME_DOC, new RenameElementOut(this.docId, this.doc.title));
  }

  public onColorChange(color: string) {
    this.doc.color = color;
    this.project.colorDoc(this.tabId, this.doc.color);
    this.socket.emit(Flags.COLOR_DOC, new ColorElementOut(this.docId, color));
  }

  public deleteDoc() {
    const dialog = this.dialog.open(ConfirmComponent, {
      data: "Supprimer le doc ?"
    });
    dialog.componentInstance.confirm.subscribe(() => {
      dialog.close();
      this.socket.emit(Flags.REMOVE_DOC, this.docId);
      this.project.removeDoc(this.tabId);
      this.tabs.removeTab();
    });
  }

  public openTagEdit() {
    this.dialog.open(EditTagsComponent, {
      data: [this.tabId, TabTypes.DOCUMENT],
      width: "600px",
      maxWidth: "90%",
      maxHeight: "90%"
    });
  }

  get doc(): DocumentSock {
    return this.project.openDocs[this.tabId];
  }
  get docId(): number {
    return this.tabs.displayedTab[1].id;
  }
  get docTags(): Tag[] {
    const tagIds = this.doc.tags.map(el => el.id);
    return this.project.tags.filter(el => tagIds.includes(el.id));
  }
  get tabId(): string {
    return this.tabs.displayedTab[1].tabId;
  }
}
