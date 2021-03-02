import { Tag } from './../../../models/sockets/tag-sock.model';
import { SocketService } from './../../../services/socket.service';
import { ProjectService } from './../../../services/project.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { diff as arrayDiff } from "fast-array-diff";
import { Flags } from 'src/app/models/sockets/flags.enum';
import { EditTagDocumentReq } from 'src/app/models/sockets/document-sock.model';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
})
export class EditTagsComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public tabId: string,
    public readonly project: ProjectService,
    private readonly socket: SocketService
  ) { }

  updateTags(editedTags: string[]) {
    console.log(editedTags);
    const createdTags = editedTags.filter(el => !this.project.tags.find(value => el === value.name)).map(el => new Tag(el));
    const newTags = [...this.project.tags.filter(el => editedTags.includes(el.name)), ...createdTags];
    const oldTags = this.doc.tags;
    const diff = arrayDiff(oldTags, newTags, (a, b) => a.name === b.name);
    this.project.updateDocTags(this.tabId, newTags);
    const docId = this.project.openDocs[this.tabId].id;

    //Little patch with filter method to avoid repetitions in diff.added and removed
    for (const addedTag of diff.added.filter(el => !diff.removed.find(val => val.name === el.name)))
      this.socket.socket.emit(Flags.TAG_ADD_DOC, new EditTagDocumentReq(docId, addedTag.name));
    for (const removedTag of diff.removed.filter(el => !diff.added.find(val => val.name == el.name)))
      this.socket.socket.emit(Flags.TAG_REMOVE_DOC, new EditTagDocumentReq(docId, removedTag.name));
  }
  public tagClick(tagName: string) {
    console.log(tagName);
  }

  get doc() {
    return this.project.openDocs[this.tabId];
  }

  get tagNames() {
    return this.project.tags?.map(el => el.name) ?? [];
  }
  get docTags() {
    return this.doc.tags;
  }
  get docTagNames() {
    return this.docTags?.map(el => el.name) ?? [];
  }
  get docTagColors() {
    const map = new Map<string, string>();
    for (const el of this.docTags)
      map.set(el.name, el.color);
    return map;
  }
}
