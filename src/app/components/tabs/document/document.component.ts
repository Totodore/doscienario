import { DocumentWorkerService } from './../../../services/document-worker.service';
import { ApiService } from 'src/app/services/api.service';
import { TabService } from './../../../services/tab.service';
import { Change, DocumentModel } from './../../../models/sockets/document-sock.model';
import { ProgressService } from 'src/app/services/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from './../../../services/socket.service';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { Component, Input, OnInit, Type, OnDestroy, ChangeDetectionStrategy, Provider, ViewEncapsulation } from '@angular/core';
import * as CKEditor from "../../../../lib/ckeditor.js";
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { v4 as uuid4 } from "uuid";
import { Flags } from 'src/app/models/sockets/flags.enum';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements ITabElement, OnDestroy {

  public show: boolean = false;
  public content: string = "";
  public tabId: string;
  public lastChangeId: number;

  public readonly type = TabTypes.DOCUMENT;
  public readonly editor: CKEditor5.EditorConstructor = CKEditor;
  public readonly editorCongig: CKEditor5.Config = {
    toolbar: {
      items: [
        "heading", "|", "bold", "italic", "Underline", "BlockQuote", "HorizontalLine","|",
        "numberedList", "bulletedList", "|",
        "indent", "outdent", "|", "link", "imageUpload",
        "insertTable", "mediaEmbed", "|",
        "undo", "redo"
      ],
      shouldNotGroupWhenFull: true
    },
    mention: {
      feeds: [
        {
          marker: '@',
          feed: (query: string) => this.atDocNames(query),
        },
        {
          marker: '#',
          feed: (query: string) => this.atTagNames(query),
        }
      ]
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: `${this.api.root}/res/${this.project.id}/image`,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
          Authorization: this.api.jwt
      }
    }
  };

  private displayProgress: boolean = false;
  private hasEdited: boolean = false;

  constructor(
    private readonly socket: SocketService,
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
    private readonly tabs: TabService,
    private readonly docWorker: DocumentWorkerService,
    private readonly api: ApiService
  ) { }

  onClose() {
    this.socket.socket.emit(Flags.CLOSE_DOC, this.id);
  }

  openTab(id?: number): string {
    this.tabId = uuid4();
    this.progress.show();
    this.socket.socket.emit(Flags.OPEN_DOC, [this.tabId, id]);
    this.docWorker.worker.addEventListener<Change[]>(`diff-${this.tabId}`, (data) => this.onDocParsed(data));
    return this.tabId;
  }

  ngOnDestroy() {
    this.docWorker.worker.removeEventListener(`diff-${this.tabId}`);
  }

  editorLoaded(editor: CKEditor5.Editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    this.addTagsListener();
    window.setInterval(() => this.hasEdited && this.addTagsListener(), 1000);
  }

  loadedTab() {
    this.progress.hide();
    this.content = this.doc.content;
  }

  onChange(data: string) {
    this.hasEdited = true;
    if (Math.abs(data.length - this.content.length) > 500) {
      const change: Change = [2, null, data];
      this.socket.updateDocument(this.id, this.tabId, [change], this.doc.lastChangeId, ++this.doc.clientUpdateId);
    } else {
      this.docWorker.worker.postMessage<[string, string]>(`diff-${this.tabId}`, [this.content, data]);
      this.progressWatcher();
    }
    this.content = data;
  }

  private onDocParsed(changes: Change[]) {
    // console.log("Doc changed", changes);
    this.displayProgress = false;
    this.progress.hide();
    try {
      this.socket.updateDocument(this.id, this.tabId, changes, this.doc.lastChangeId, ++this.doc.clientUpdateId);
    } catch (error) {   }
  }

  private progressWatcher() {
    this.displayProgress = true;
    setTimeout(() => this.displayProgress && this.progress.show(), 1000);
  }
  private atDocNames(query: string): string[] {
    return this.project.docs.filter(el => el.title.toLowerCase().startsWith(query.toLowerCase())).map(el => "@" + el.title);
  }

  private atTagNames(query: string): string[] {
    return this.project.tags.filter(el => el.name.toLowerCase().startsWith(query.toLowerCase())).map(el => "#" + el.name);
  }

  private addTagsListener() {
    document.querySelectorAll(".ck-content .mention")
      .forEach((el: HTMLSpanElement) => el.onclick = () => this.onTagClick(el.getAttribute("data-mention")));
    this.hasEdited = false;
  }

  private onTagClick(tag: string) {
    if (tag.startsWith("@")) {
      const docId = this.project.docs.find(el => el.title.toLowerCase() === tag.substr(1).toLowerCase())?.id;
      if (docId)
        this.tabs.pushTab(DocumentComponent, true, docId);
    } else if (tag.startsWith("#")) {}
  }

  get doc(): DocumentModel {
    return this.project.openDocs[this.tabId];
  }

  get title(): string {
    if (this.doc == null)
      return "Chargement...";
    else if (this.doc.title?.length == 0)
      return "Nouveau document";
    else return this.doc.title;
  }

  get id(): number {
     return this.doc?.id;
  }

}
