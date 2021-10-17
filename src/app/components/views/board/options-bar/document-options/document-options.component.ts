import { ColorElementOut } from './../../../../../models/sockets/out/element.out';
import { TabTypes } from './../../../../../models/tab-element.model';
import { ConfirmComponent } from './../../../../utils/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { SocketService } from '../../../../../services/sockets/socket.service';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from './../../../../../services/tab.service';
import { Component } from '@angular/core';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { EditTagsComponent } from 'src/app/components/modals/edit-tags/edit-tags.component';
import { RenameElementOut } from 'src/app/models/sockets/out/element.out';
import { DocumentSock } from 'src/app/models/api/document.model';
import { Tag } from 'src/app/models/api/tag.model';

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
    this.socket.socket.emit(Flags.RENAME_DOC, new RenameElementOut(this.docId, this.doc.title));
  }

  public onColorChange(color: string) {
    this.doc.color = color;
    this.project.colorDoc(this.tabId, this.doc.color);
    this.socket.socket.emit(Flags.COLOR_DOC, new ColorElementOut(this.docId, color));
  }

  public deleteDoc() {
    const dialog = this.dialog.open(ConfirmComponent, {
      data: "Supprimer le doc ?"
    });
    dialog.componentInstance.confirm.subscribe(() => {
      dialog.close();
      this.socket.socket.emit(Flags.REMOVE_DOC, this.docId);
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
