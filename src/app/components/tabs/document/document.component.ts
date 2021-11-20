import { EditorWorkerService } from './../../../services/document-worker.service';
import { ApiService } from 'src/app/services/api.service';
import { TabService } from './../../../services/tab.service';
import { ProgressService } from 'src/app/services/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { Component, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
//@ts-ignore
import * as CKEditor from "../../../../lib/ckeditor.js";
import { CKEditor5, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { ElementComponent } from '../element.component';
import { DocsSocketService } from 'src/app/services/sockets/docs-socket.service';
import { Change } from 'src/app/models/sockets/in/element.in';
import { DocumentSock } from 'src/app/models/api/document.model';
import { MatDialog } from '@angular/material/dialog';
import { SheetEditorComponent } from './sheet-editor/sheet-editor.component';
import { Sheet } from 'src/app/models/api/sheet.model';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent extends ElementComponent implements ITabElement, OnDestroy {

  public lastChangeId: number;

  @ViewChild("editorView", { static: false })
  private editorView?: ElementRef<HTMLElement>;
  private editorInstance?: CKEditor5.Editor;
  public openedSheet?: SheetEditorComponent;

  public textSelectionPos?: DOMRect;

  public readonly type = TabTypes.DOCUMENT;
  public readonly editor: CKEditor5.EditorConstructor = CKEditor;
  public readonly editorCongig: CKEditor5.Config = {
    toolbar: {
      items: [
        "heading", "|", "bold", "italic", "Underline", "BlockQuote", "HorizontalLine", "FontColor", "|",
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
          marker: "/",
          feed: (query: string) => [],
        },
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
    private readonly socket: DocsSocketService,
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    private readonly docWorker: EditorWorkerService,
    private readonly api: ApiService,
    private readonly dialog: MatDialog,
    progress: ProgressService,
  ) {
    super(progress);
  }

  public onClose() {
    this.socket.socket.emit(Flags.CLOSE_DOC, this.id);
    super.onClose();
  }

  public openTab(id: string | number): string {
    super.openTab(id);
    this.socket.socket.emit(Flags.OPEN_DOC, [this.tabId, id]);
    this.docWorker.worker.addEventListener<Change[]>(`diff-${this.tabId}`, (data) => this.onDocParsed(data));
    if (!this.tabId)
      throw new Error("No tabId for document");
    return this.tabId;
  }

  public ngOnDestroy() {
    this.docWorker.worker.removeEventListener(`diff-${this.tabId}`);
  }

  public editorLoaded(editor: CKEditor5.Editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    editor.model.document.on("change", (e: any) => !e.name.endsWith(":data") && this.onTextSelection());
    this.editorInstance = editor;
    this.contentElement = this.editorView?.nativeElement.querySelector(".ck-content") as HTMLElement;
    this.contentElement.scrollTo({ left: this.scroll?.[0], top: this.scroll?.[1], behavior: "auto" });
    window.setInterval(() => this.hasEdited && this.addTagsListener(), 1000);
    this.addTagsListener();
  }

  public loadedTab() {
    super.loadedTab();
    this.project.openDocs[this.tabId!].content = this.doc.content;
  }

  public onChange(e: ChangeEvent) {
    const data = e.editor.getData();
    this.hasEdited = true;
    if (Math.abs(data.length - this.doc.content.length) > 500) {
      const change: Change = [2, null, data];
      this.socket.updateDocument(this.id, this.tabId!, [change], this.doc.lastChangeId, ++this.doc.clientUpdateId!);
    } else {
      this.docWorker.worker.postMessage<[string, string]>(`diff-${this.tabId}`, [this.doc.content, data]);
      this.progressWatcher();
    }
    this.project.openDocs[this.tabId!].content = data;
  }

  private onDocParsed(changes: Change[]) {
    this.displayProgress = false;
    this.progress.hide();
    try {
      this.socket.updateDocument(this.id, this.tabId!, changes, this.doc.lastChangeId, ++this.doc.clientUpdateId);
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
    return this.project.tags.filter(el => el.title.toLowerCase().startsWith(query.toLowerCase())).map(el => "#" + el.title);
  }

  private addTagsListener() {
    this.contentElement.querySelectorAll(".mention")
      .forEach((el: HTMLSpanElement) => el.onclick ??= () => this.onTagClick(el.getAttribute("data-mention")));
    this.hasEdited = false;
  }

  private onTagClick(tag: string) {
    if (tag.startsWith("@")) {
      const docId = this.project.docs.find(el => el.title.toLowerCase() === tag.substr(1).toLowerCase())?.id;
      if (docId)
        this.tabs.pushTab(DocumentComponent, true, docId);
    } else if (tag.startsWith("#")) {

    } else if (tag.startsWith("/")) {
      const sheet = this.sheets.find(el => el.title.toLowerCase() === tag.substr(1).toLowerCase());
      if (sheet)
        this.openSheet(sheet.id);
    }
  }

  /**
   * Find a mention inside the ckeditor model from a mention title
   * @param mention The title of the mention
   * @returns A Mention object
   */
  private findMentionsFromModel(mention: string): any[] {
    const childIterate = (element: any) => {
      const mentions = [];
      for (const attr of element.getAttributes()) {
        if (attr[0] === "mention" && attr[1].id === `/${mention}`)
          mentions.push(element);
      }
      if (element.is("element")) {
        for (const child of element.getChildren()) {
          const mention = childIterate(child);
          if (mention)
            mentions.push(...mention);
        }
      }
      return mentions;
    }
    return childIterate(this.editorInstance.model.document.getRoot());
  }

  public onTextSelection() {
    const selection = window.getSelection();
    const mentions = Array.from(this.editorView.nativeElement.querySelectorAll(".mention"));
    const containsNode = mentions && mentions.reduce((prev, curr) => prev || selection.containsNode(curr, true), false);
    if (selection.type === "Range" && selection.toString().trim().length > 0 && !containsNode)
      this.textSelectionPos = selection.getRangeAt(0).getBoundingClientRect()
    else 
      this.textSelectionPos = null;
  }

  public async onAddSheet() {
    const selection = window.getSelection();
    let title = selection.toString().trim();
    if (title.startsWith("/")) title = title.substr(1);
    this.editorInstance.execute("mention", {
      marker: "/",
      mention: {
        id: "/" + title,
        name: title,
        title,
      },
      range: this.editorInstance.model.document.selection.getFirstRange(),
    });
    this.hasEdited = true;
    this.openSheet(this.sheets.find(el => el.title.toLowerCase() == title.toLowerCase())?.id || title);
    this.textSelectionPos = null;
    selection.collapseToEnd();
    this.editorInstance.editing.view.focus();
  }

  /**
   * This will transform the sheet tag to a normal text
   */
  public async onRemoveSheet(sheet: Sheet) {
    this.editorInstance.model.change(writer => {
      const mentions = this.findMentionsFromModel(sheet.title);
      for (const mention of mentions) {
        const text = writer.createText(sheet.title);
        const pos = writer.createPositionAt(mention.parent, mention.index);
        writer.insert(text, pos);
        writer.remove(mention);
      }
    });
    this.editorInstance.editing.view.focus();
  }

  public scrollToSheet(sheet: Sheet) {
    const element = this.contentElement.querySelector(`[data-mention="/${sheet.title}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      this.contentElement.scrollTo({ left: rect.left, top: rect.top, behavior: "smooth" });
    }
  }

  public openSheet(idOrTitle: number | string) {
    const dial = this.dialog.open(SheetEditorComponent, {
      data: [this.id, idOrTitle],
      closeOnNavigation: false,
      height: "90%",
      width: "80%",
      maxWidth: "100%",
      id: "editor-dialog",
    });
    this.openedSheet = dial.componentInstance;
    // dial.afterClosed().subscribe(() => this.openedSheet = undefined);
  }
  
  public getSortedSheets(): [Sheet[], Sheet[]] {
    const mentions = this.contentElement?.querySelectorAll("span.mention[data-mention^='/']") || [];
    const sheets = new Set<Sheet>();
    for (let i = 0; i < mentions.length; i++) {
      const title = mentions[i].getAttribute("data-mention");
      if (title?.startsWith("/")) {
        const sheet = this.sheets.find(el => el.title?.toLowerCase() === title.substr(1).toLowerCase());
        if (sheet)
          sheets.add(sheet);
      }
    }
    return [Array.from(sheets), this.sheets.filter(el => !sheets.has(el))];
  }

  get doc(): DocumentSock {
    return this.project.openDocs[this.tabId!]!;
  }

  get sheets(): Sheet[] {
    return this.project.docs.find(el => el.id == this.id).sheets || [];
  }

  get title(): string {
    if (this.doc == null)
      return "Chargement...";
    else if (this.doc.title?.length == 0)
      return "Nouveau document";
    else return this.doc.title;
  }

  get id(): number | undefined {
    return this.doc?.id;
  }

}
