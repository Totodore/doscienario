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
export class DocumentOptionsComponent implements OnInit {


  private index: number;
  private id: number;

  constructor(
    private readonly tabs: TabService,
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.index = this.tabs.displayedTab[0];
    this.id = this.tabs.displayedTab[1].id;
  }

  onRename() {
    this.project.renameDoc(this.id, this.doc.title);
    this.socket.socket.emit(Flags.RENAME_DOC, new RenameDocumentReq(this.id, this.doc.title));
  }
  openTagEdit() {
    this.dialog.open(EditTagsComponent, {
      data: this.id,
      width: "600px",
      maxWidth: "90%",
      maxHeight: "90%"
    });
  }

  get doc() {
    return this.project.openDocs.find(el => el.id == this.id);
  }
}
