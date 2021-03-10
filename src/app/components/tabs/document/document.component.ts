import { TabService } from './../../../services/tab.service';
import { SnackbarService } from './../../../services/snackbar.service';
import { WorkerManagerService } from '../../../services/worker-manager.service';
import { Change, DocumentModel } from './../../../models/sockets/document-sock.model';
import { ProgressService } from 'src/app/services/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from './../../../services/socket.service';
import { ITabElement } from './../../../models/tab-element.model';
import { Component, Input, OnInit } from '@angular/core';
import * as CKEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { v4 as uuid4 } from "uuid";
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, ITabElement {

  public show: boolean = false;
  public content: string = "";
  public tabId: string;
  public lastChangeId: number;
  public readonly editor = CKEditor;
  public tag: string;
  public tagIndex: number;

  private displayProgress: boolean = false;

  constructor(
    private readonly socket: SocketService,
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
    private readonly tabs: TabService,
    private readonly worker: WorkerManagerService,
    private readonly snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.worker.addEventListener<Change[]>("diff", (data) => this.onDocParsed(data));
  }

  openTab(id?: number): string {
    this.tabId = uuid4();
    this.progress.show();
    this.socket.openDocument(this.tabId, id);
    return this.tabId;
  }

  editorLoaded(editor: CKEditor5.BaseEditor): void {
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

    const el = document.createElement("div");
    el.innerHTML = data;
    const lastChar = el.innerText[el.innerText.length - 1];
    if (lastChar === '@' && !this.tag && this.tagIndex >= 0) {
      this.tag = "";
      this.tagIndex = el.innerText.length - 1;
    } else if (lastChar?.charCodeAt(0) === 160) {
      this.tag = "";
      this.tagIndex = -1;
    } else
      this.tag += lastChar;

    console.log(this.tag, this.tagIndex);
  }

  private onDocParsed(changes: Change[]) {
    // console.log("Doc changed", changes);
    this.displayProgress = false;
    this.progress.hide();
    try {
      this.socket.updateDocument(this.docId, this.tabId, changes, this.doc.lastChangeId, ++this.doc.clientUpdateId);
    } catch (error) {   }
  }

  private progressWatcher() {
    this.displayProgress = true;
    setTimeout(() => this.displayProgress && this.progress.show(), 1000);
  }

  get doc(): DocumentModel {
    const doc = this.project.openDocs[this.tabId];
    this.content = doc?.content || "";
    return doc;
  }

  get title(): string {
    if (this.doc == null)
      return "Chargement...";
    else if (this.doc.title?.length == 0)
      return "Nouveau document";
    else return this.doc.title;
  }

  get docId(): number {
     return this.doc?.id;
  }

}
