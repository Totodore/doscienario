import { WorkerManagerService } from '../../../services/worker-manager.service';
import { Change, DocumentModel } from './../../../models/sockets/document-sock.model';
import { ProgressService } from 'src/app/services/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from './../../../services/socket.service';
import { ITabElement } from './../../../models/tab-element.model';
import { Component, OnInit } from '@angular/core';
import * as CKEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, ITabElement {

  public title: string = "Chargement...";
  public show: boolean = false;
  public content: string = "";
  public id: number = 60;
  public lastChangeId: number;
  public readonly editor = CKEditor;

  private displayProgress: boolean = false;

  constructor(
    private readonly socket: SocketService,
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
    private readonly worker: WorkerManagerService
  ) { }

  ngOnInit(): void {
    this.progress.show();
    this.socket.openDocument(this.id);
    this.worker.addEventListener<Change[]>("diff", (data) => this.onDocParsed(data));
  }

  docLoaded(editor: CKEditor5.BaseEditor): void {
    this.title = this.doc?.title ? this.doc.title : this.title;
    this.progress.hide();
    this.content = this.doc.content;
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    )
  }

  onChange(data: string) {
    this.worker.postMessage<[string, string]>("diff", [this.content, data]);
    this.content = data;
    this.progressWatcher();
  }

  private onDocParsed(changes: Change[]) {
    console.log("Doc changed", changes);
    this.displayProgress = false;
    this.progress.hide();
    this.socket.updateDocument(this.id, changes, this.doc.lastChangeId, ++this.doc.clientUpdateId);
  }

  private progressWatcher() {
    this.displayProgress = true;
    setTimeout(() => this.displayProgress && this.progress.show(), 1000);
  }

  get doc(): DocumentModel {
    const doc = this.project.openDocs?.find(el => el?.id == this?.id);
    this.content = doc?.content || "";
    return doc;
  }

}
