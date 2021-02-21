import { Change, DocumentModel } from './../../../models/sockets/document-sock.model';
import { ProgressService } from 'src/app/services/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from './../../../services/socket.service';
import { ITabElement } from './../../../models/tab-element.model';
import { Component, OnInit } from '@angular/core';
import * as CKEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import * as diff from "diff";
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, ITabElement {

  public title: string = "Chargement...";
  public show: boolean = false;
  public content: string = "";
  public id: number = 34;
  public clientUpdateId: number = 0;
  public lastChangeId: number;
  public readonly editor = CKEditor;

  constructor(
    private readonly socket: SocketService,
    private readonly project: ProjectService,
    private readonly progress: ProgressService
  ) { }

  ngOnInit(): void {
    this.progress.show();
    this.socket.openDocument(this.id);
  }

  docLoaded(editor: CKEditor5.BaseEditor): void {
    this.title = this.doc?.title ? this.doc.title : this.title;
    this.progress.hide();
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    )
  }

  onChange(data: string) {
    let i = 0;
    let changes: Change[] = [];
    for (const change of diff.diffChars(this.content, data)) {
      if (!change.added && !change.removed)
        changes.push([0, i, change.count]);
      else if (change.added)
        changes.push([1, change.value]);
      else
        changes.push([-1, change.value]);
      i += change.count;
    }
    console.log(this.content, changes, this.doc.lastChangeId);
    this.socket.updateDocument(this.id, changes, this.doc.lastChangeId, ++this.clientUpdateId);
    this.content = data;
  }

  get doc(): DocumentModel {
    return this.project.openDocs?.find(el => el?.id == this?.id);
  }

}
