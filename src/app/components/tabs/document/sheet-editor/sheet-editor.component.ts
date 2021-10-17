import { TabService } from './../../../../services/tab.service';
import { ProjectService } from './../../../../services/project.service';
import { Component, OnInit, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CKEditor5, CKEditorComponent, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import * as CKEditor from "../../../../../lib/ckeditor.js";
import { DocumentComponent } from '../document.component';

@Component({
  templateUrl: './sheet-editor.component.html',
  styleUrls: ['./sheet-editor.component.scss']
})
export class SheetEditorComponent {

  public readonly editor: CKEditor5.EditorConstructor = CKEditor;
  public readonly editorCongig: CKEditor5.Config = {
    toolbar: {
      items: [
        "heading", "|", "bold", "italic", "Underline", "BlockQuote", "HorizontalLine", "FontColor", "|",
        "numberedList", "bulletedList", "|",
        "indent", "outdent", "|", "link",
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

  private docId: number;
  private sheetId: number;

  @ViewChild("wrapper")
  private wrapper: ElementRef<HTMLDivElement>;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: [number, number],
    private readonly project: ProjectService,
    private readonly tabs: TabService,
  ) {
    this.docId = data[0];
    this.sheetId = data[1];
  }

  public onContentUpdate(e: ChangeEvent) {
    this.hasEdited = true;
  }
  
  public editorLoaded(editor: CKEditor5.Editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    this.addTagsListener();
    window.setInterval(() => this.hasEdited && this.addTagsListener(), 1000);
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
      const docId = this.project.docs.find(el => el.title.toLowerCase() === tag.substr(1).toLowerCase())?.id;
      if (docId)
        this.tabs.pushTab(DocumentComponent, true, docId);
    } else if (tag.startsWith("#")) {

    }
  }

  public get sheet() {
    return this.project.docs.find(el => el.id === this.docId).sheets.find(el => el.id === this.sheetId);
  }

}
