import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { DocumentModel } from './../../../../../models/sockets/document-sock.model';
import { MatDialog } from '@angular/material/dialog';
import { SocketService } from './../../../../../services/socket.service';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from './../../../../../services/tab.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { RenameDocumentReq } from 'src/app/models/sockets/document-sock.model';
import { EditTagsComponent } from 'src/app/components/utils/edit-tags/edit-tags.component';

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

  onRename() {
    this.project.renameDoc(this.tabId, this.doc.title);
    this.socket.socket.emit(Flags.RENAME_DOC, new RenameDocumentReq(this.docId, this.doc.title));
  }
  openTagEdit() {
    this.dialog.open(EditTagsComponent, {
      data: this.tabId,
      width: "600px",
      maxWidth: "90%",
      maxHeight: "90%"
    });
  }

  deleteDoc() {

  }

  get doc(): DocumentModel {
    return this.project.openDocs[this.tabId];
  }
  get docId(): number {
    return this.tabs.displayedTab[1].docId;
  }
  get docTags(): Tag[] {
    const tagIds = this.doc.tags.map(el => el.id);
    return this.project.tags.filter(el => tagIds.includes(el.id));
  }
  get tabId(): string {
    return this.tabs.displayedTab[1].tabId;
  }
}
