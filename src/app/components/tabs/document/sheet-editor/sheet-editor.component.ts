import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeEvent, CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { ConfirmComponent } from 'src/app/components/utils/confirm/confirm.component';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Change } from 'src/app/models/sockets/in/element.in';
import { OpenSheetOut } from 'src/app/models/sockets/out/sheet.out';
import { EditorWorkerService } from 'src/app/services/document-worker.service';
import { SocketService } from 'src/app/services/sockets/socket.service.js';
import { ProgressService } from 'src/app/services/ui/progress.service';
import { applyTabPlugin } from 'src/app/utils/doc.utils';
import { v4 as uuid } from 'uuid';
import * as CKEditor from "../../../../../lib/ckeditor.js";
import { SheetIoHandler } from '../../../../services/sockets/sheet-io.handler.service';
import { DocumentComponent } from '../document.component';
import { ProjectService } from './../../../../services/project.service';
import { TabService } from './../../../../services/tab.service';

@Component({
  templateUrl: './sheet-editor.component.html',
  styleUrls: ['./sheet-editor.component.scss']
})
export class SheetEditorComponent implements OnInit {

  public readonly editor: CKEditor5.EditorConstructor = CKEditor;
  public readonly editorCongig: CKEditor5.Config = {
    toolbar: {
      items: [
        "heading", "|", "bold", "italic", "Underline", "BlockQuote", "HorizontalLine", "FontColor", "|",
        "numberedList", "bulletedList", "|",
        "alignment", "indent", "outdent", "|", "link",
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
  }

  private hasEdited = false;
  private title = "";

  private docId: number;
  private sheetId: number;
  private readonly tabId: string;

  @ViewChild("wrapper")
  private wrapper: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: [number, number | string],
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    private readonly sheetIo: SheetIoHandler,
    private readonly socket: SocketService,
    private readonly editorWorker: EditorWorkerService,
    private readonly progress: ProgressService,
    private readonly dialogRef: MatDialogRef<SheetEditorComponent>,
    private readonly dialog: MatDialog,
  ) {
    this.docId = data[0];
    if (typeof data[1] === "number")
      this.sheetId = data[1];
    else
      this.title = data[1];
    this.tabId = uuid();
  }

  public ngOnInit(): void {
    this.progress.show();
    this.socket.emit(Flags.OPEN_SHEET, new OpenSheetOut(this.tabId, this.docId, this.sheetId, this.title));
    this.editorWorker.worker.addEventListener<Change[]>(`diff-${this.tabId}`, data => this.onChangeParsed(data));
  }

  public loadedSheet() {
    this.progress.hide();
  }

  public onChange(e: ChangeEvent) {
    this.hasEdited = true;
    const data = e.editor.getData();
    if (Math.abs(data.length - this.sheet.content.length) > 500) {
      const change: Change = [2, null, data];
      this.sheetIo.updateSheet(this.id, this.tabId, [change], this.sheet.lastChangeId, ++this.sheet.clientUpdateId);
    } else
      this.editorWorker.worker.postMessage<[string, string]>(`diff-${this.tabId}`, [this.sheet.content, data]);
    this.project.openSheets[this.tabId].content = data;
  }

  public editorLoaded(editor: CKEditor5.Editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    applyTabPlugin(editor);
    this.addTagsListener();
    window.setInterval(() => this.hasEdited && this.addTagsListener(), 1000);
  }

  public onChangeParsed(changes: Change[]) {
    this.sheetIo.updateSheet(this.id, this.tabId, changes, this.sheet.lastChangeId, ++this.sheet.clientUpdateId);
  }

  public onSheetClose() {
    delete this.project.openSheets[this.tabId];
    this.dialogRef.close();
  }
  public onSheetDelete() {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer cette note ?" });
    dialog.componentInstance.confirm.subscribe(() => {
      this.socket.emit(Flags.REMOVE_SHEET, [this.id, this.docId]);
      (this.tabs.displayedTab[1] as DocumentComponent)?.onRemoveSheet?.(this.sheet);
      this.project.removeSheet(this.tabId, this.docId);
      this.onSheetClose();
      dialog.close();
    });
  }

  private atDocNames(query: string): string[] {
    return this.project.docs.filter(el => el.title.toLowerCase().startsWith(query.toLowerCase())).map(el => "@" + el.title);
  }

  private atTagNames(query: string): string[] {
    return this.project.tags.filter(el => el.title.toLowerCase().startsWith(query.toLowerCase())).map(el => "#" + el.title);
  }

  private addTagsListener() {
    this.wrapper.nativeElement.querySelectorAll(".ck-content .mention")
      .forEach((el: HTMLSpanElement) => el.onclick = () => this.onTagClick(el.getAttribute("data-mention")));
    this.hasEdited = false;
  }

  private onTagClick(tag: string) {
    if (tag.startsWith("@")) {
      const docId = this.project.docs.find(el => el.title.toLowerCase() === tag.substring(1).toLowerCase())?.id;
      if (docId)
        this.tabs.pushTab(DocumentComponent, true, docId);
    } else if (tag.startsWith("#")) {

    }
  }

  public get sheet() {
    return this.project.openSheets[this.tabId];
  }
  public get id() { return this.sheet?.id; }
  public get content() { return this.sheet?.content; }

}
