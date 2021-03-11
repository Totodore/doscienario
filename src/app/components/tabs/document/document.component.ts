import { TabService } from './../../../services/tab.service';
import { SnackbarService } from './../../../services/snackbar.service';
import { WorkerManagerService } from '../../../services/worker-manager.service';
import { Change, DocumentModel } from './../../../models/sockets/document-sock.model';
import { ProgressService } from 'src/app/services/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from './../../../services/socket.service';
import { ITabElement } from './../../../models/tab-element.model';
import { Component, Input, OnInit, Type } from '@angular/core';
import * as CKEditor from "../../../../lib/ckeditor.js";
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
// import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import { v4 as uuid4 } from "uuid";
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
  public readonly editor: CKEditor5.EditorConstructor = CKEditor;
  public readonly editorCongig: CKEditor5.Config = {
    // plugins: [Mention],
    toolbar: {
      items: [
        "heading", "|", "bold", "italic", "BlockQuote", "|",
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
    }
  };

  private displayProgress: boolean = false;
  private hasEdited: boolean = false;

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

  editorLoaded(editor: CKEditor5.Editor): void {
    this.progress.hide();
    this.content = this.doc.content;
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    this.addTagsListener();
    window.setInterval(() => this.hasEdited && this.addTagsListener(), 1000);
  }

  onChange(data: string) {
    if (Math.abs(data.length - this.content.length) > 500) {
      const change: Change = [2, null, data];
      this.socket.updateDocument(this.docId, this.tabId, [change], this.doc.lastChangeId, ++this.doc.clientUpdateId);
    } else {
      this.worker.postMessage<[string, string]>("diff", [this.content, data]);
      this.progressWatcher();
    }
    this.content = data;
  }

  private onDocParsed(changes: Change[]) {
    // console.log("Doc changed", changes);
    this.displayProgress = false;
    this.progress.hide();
    this.hasEdited = true;
    try {
      this.socket.updateDocument(this.docId, this.tabId, changes, this.doc.lastChangeId, ++this.doc.clientUpdateId);
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
