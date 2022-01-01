import { ContextMenuService } from './../../../services/ui/context-menu.service';
import { EditorWorkerService } from './../../../services/document-worker.service';
import { ApiService } from 'src/app/services/api.service';
import { TabService } from './../../../services/tab.service';
import { ProgressService } from 'src/app/services/ui/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CKEditor5, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { ElementComponent } from '../element.component';
import { DocsSocketService } from 'src/app/services/sockets/docs-socket.service';
import { Change } from 'src/app/models/sockets/in/element.in';
import { DocumentSock } from 'src/app/models/api/document.model';
import { MatDialog } from '@angular/material/dialog';
import { SheetEditorComponent } from './sheet-editor/sheet-editor.component';
import { Sheet } from 'src/app/models/api/sheet.model';
import { applyTabPlugin, findStrFromSelection } from 'src/app/utils/doc.utils';
import * as CKEditor from "../../../../lib/ckeditor";
import { ConfirmComponent } from '../../utils/confirm/confirm.component';

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

  public readonly type = TabTypes.DOCUMENT;

  /**
   * Editor configuration
   */
  public readonly editor: CKEditor5.EditorConstructor = CKEditor;
  public readonly editorConfig: CKEditor5.Config = {
    toolbar: {
      items: [
        "heading", "|",
        "bold", "italic", "Underline", "BlockQuote", "HorizontalLine", "FontColor", "|",
        "numberedList", "bulletedList", "TodoList", "|",
        "alignment", "indent", "outdent", "|",
        "imageInsert", "insertTable", "FindAndReplace", "|",
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
    private readonly contextMenu: ContextMenuService,
    progress: ProgressService,
  ) {
    super(progress);
  }

  public onClose() {
    this.socket.socket.emit(Flags.CLOSE_DOC, this.id);
    super.onClose();
  }

  /**
   * Triggered when we create a new tab
   * @description Send document request and then add event listener for changes computation in worker
   * @param id can be a tab id (string) or a document id
   * @returns the tab id
   */
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

  /**
   * Triggered when the editor is loaded
   * Add the toolbar to view
   * Add tab plugin to avoid tab navigation
   * scroll to content position from the previous registered scroll position
   * Add tag listener on document to react when clicking on tag
   * @param editor the Ckeditor instance
   */
  public editorLoaded(editor: CKEditor5.Editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    applyTabPlugin(editor);
    
    this.editorInstance = editor;
    this.contentElement = editor.ui.view.editable.element as HTMLElement;
    this.contentElement.scrollTo({ left: this.scroll?.[0], top: this.scroll?.[1], behavior: "auto" });
    this.contentElement.addEventListener("contextmenu", e => this.onContextMenu(e));
    window.setInterval(() => this.hasEdited && this.addTagsListener(), 1000);
    this.addTagsListener();
  }

  /**
   * Triggerred when the tab is loaded (document received)
   */
  public loadedTab() {
    super.loadedTab();
    this.project.openDocs[this.tabId!].content = this.doc.content;
  }

  /**
   * Triggerred for each text edition
   * If the change is above 500 char (e.g copy/paste) we send the entire content
   * Else we compute diff in worker 
   */
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

  /**
   * Triggerred when the worker has finished the diff computation
   * The changes are then sent to the server trough socket
   * @param changes the changes computed by the worker
   */
  private onDocParsed(changes: Change[]) {
    this.displayProgress = false;
    this.progress.hide();
    try {
      this.socket.updateDocument(this.id, this.tabId!, changes, this.doc.lastChangeId, ++this.doc.clientUpdateId);
    } catch (error) {   }
  }

  /**
   * Method that display progress if the worker is computing diff for more than 1 second
   */
  private progressWatcher() {
    this.displayProgress = true;
    setTimeout(() => this.displayProgress && this.progress.show(), 1000);
  }

  /**
   * Doc names tag filtering from user input 
   */
  private atDocNames(query: string): string[] {
    return this.project.docs.filter(el => el.title.toLowerCase().startsWith(query.toLowerCase())).map(el => "@" + el.title);
  }

  /**
   * Tag name filtering from user input
   */
  private atTagNames(query: string): string[] {
    return this.project.tags.filter(el => el.title.toLowerCase().startsWith(query.toLowerCase())).map(el => "#" + el.title);
  }

  /**
   * Get all tag in the editor and add onclick listener if not already done
   */
  private addTagsListener() {
    this.contentElement.querySelectorAll(".mention")
      .forEach((el: HTMLSpanElement) => el.onclick ??= () => this.onTagClick(el.getAttribute("data-mention")));
    this.hasEdited = false;
  }

  /**
   * Triggerred when the user click on a tag
   * If it is a document we open it in a new tab
   * If it is a sheet we open it in the current document view
   */
  private onTagClick(tag: string) {
    if (tag.startsWith("@")) {
      const docId = this.project.docs.find(el => el.title.toLowerCase() === tag.substring(1).toLowerCase())?.id;
      if (docId)
        this.tabs.pushTab(DocumentComponent, true, docId);
    } else if (tag.startsWith("#")) {

    } else if (tag.startsWith("/")) {
      const sheet = this.sheets.find(el => el.title.toLowerCase() === tag.substring(1).toLowerCase());
      if (sheet)
        this.openSheet(sheet.id);
    }
  }

  /**
   * Get sheetTitle from the selection and open it in the current document view
   * @param e 
   * @returns 
   */
  private onContextMenu(e: MouseEvent) {
    const selection = window.getSelection();
    const hasSelection = selection.type === "Range";
    //We get range selection and otherwise we find the word under the cursor
    const strSelectionData = findStrFromSelection(selection);
    const sheetTitle = selection.toString().trim() || strSelectionData.str;
    const mentions = Array.from(this.editorView.nativeElement.querySelectorAll(".mention"));
    
    //We get the included mention in the selection
    const includedMention = mentions && mentions.reduce((prev, curr) => prev || selection.containsNode(curr, true) ? curr : null, null);
    
    const selectWord = () => {
      if (selection.type != 'Range') {
        const range = selection.getRangeAt(0);
        range.setStart(strSelectionData.node, strSelectionData.offset[0]);
        range.setEnd(strSelectionData.node, strSelectionData.offset[1]);
      }
    }

    if (sheetTitle?.length > 0 && !sheetTitle.includes('\n') && !includedMention) {
      
      this.contextMenu.show(e, [{
        label: "Ajouter une note", action: () => {
          selectWord();
          setTimeout(() => this.onAddSheet(sheetTitle), 0);
        }, icon: "add"
      }]);

    } else if (includedMention) {

      const sheet = this.sheets.find(el => el.title == (!hasSelection ? strSelectionData.str : includedMention.getAttribute("data-mention")).substring(1));
      if (!sheet) return;
      this.contextMenu.show(e, [{
        label: "Supprimer la note", action: () => {
          selectWord();
          setTimeout(() => this.removeSheet(sheet), 0);
        }, icon: "delete"
      }]);
      
    }
  }

  /**
   * Remove a given sheet from the document and from the editor
   * @param sheet The sheet to remove
   */
  private removeSheet(sheet: Sheet) {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer cette note ?" });
    dialog.componentInstance.confirm.subscribe(() => {
      this.socket.socket.emit(Flags.REMOVE_SHEET, [sheet.id, this.id]);
      this.project.removeSheet(sheet.id, this.id);
      this.onRemoveSheet(sheet);
      dialog.close();
    });
  }

  /**
   * Find a mention inside the ckeditor model from a mention title with recursion
   * Used to edit mention when removing a sheet
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


  public async onAddSheet(title: string) {
    if (title.startsWith("/")) title = title.substring(1);
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
    window.getSelection().collapseToEnd();
    this.editorInstance.editing.view.focus();
  }

  /**
   * This will transform the sheet tag to a normal text
   */
  public onRemoveSheet(sheet: Sheet) {
    this.editorInstance.model.change(writer => {
      const mentions = this.findMentionsFromModel(sheet.title);
      for (const mention of mentions) {
        const text = writer.createText(sheet.title);
        const pos = writer.createPositionAt(mention.parent, mention.startOffset);
        writer.insert(text, pos);
        writer.remove(mention);
      }
    });
    this.editorInstance.editing.view.focus();
  }

  /**
   * Scroll the editor viewport to a given sheet
   */
  public scrollToSheet(sheet: Sheet) {
    const element = this.contentElement.querySelector(`[data-mention="/${sheet.title}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      this.contentElement.scrollTo({ left: rect.left, top: rect.top, behavior: "smooth" });
    }
  }

  /**
   * Open a sheet in the current document view
   * @param idOrTitle The id or title of the sheet to open
   * If it is a title the sheet will be created
   */
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
  }
  
  /**
   * Get a list of all the sheets in the document
   * The first list is the sheets detected in the text
   * The second list is the sheets that aren't
   */
  public getSortedSheets(): [Sheet[], Sheet[]] {
    const mentions = this.contentElement?.querySelectorAll("span.mention[data-mention^='/']") || [];
    const sheets = new Set<Sheet>();
    for (let i = 0; i < mentions.length; i++) {
      const title = mentions[i].getAttribute("data-mention");
      if (title?.startsWith("/")) {
        const sheet = this.sheets.find(el => el.title?.toLowerCase() === title.substring(1).toLowerCase());
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
