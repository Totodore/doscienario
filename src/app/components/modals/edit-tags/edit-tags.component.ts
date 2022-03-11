import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { diff as arrayDiff } from "fast-array-diff";
import { NGXLogger } from 'ngx-logger';
import { Blueprint } from 'src/app/models/api/blueprint.model';
import { DocumentSock } from 'src/app/models/api/document.model';
import { Tag } from 'src/app/models/api/tag.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { TabTypes } from 'src/app/models/sys/tab.model';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { AddTagElementOut, RemoveTagElementOut } from './../../../models/sockets/out/tag.out';
import { ProjectService } from './../../../services/project.service';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
})
export class EditTagsComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: [string, TabTypes],
    public readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly logger: NGXLogger,
  ) { }

  updateTags(editedTags: string[]) {
    this.logger.log(editedTags);
    const createdTags = editedTags.filter(el => !this.project.tags.find(value => el === value.title)).map(el => new Tag(el));
    const newTags = [...this.project.tags.filter(el => editedTags.includes(el.title)), ...createdTags];
    const oldTags = this.el.tags ?? [];
    const diff = arrayDiff(oldTags, newTags, (a, b) => a.title === b.title);
    let docId: number;
    if (this.data[1] === TabTypes.DOCUMENT) {
      this.project.updateDocTags(this.data[0], newTags);
      docId = this.project.openDocs[this.data[0]].id;

      //Little patch with filter method to avoid repetitions in diff.added and removed
      for (const addedTag of diff.added.filter(el => !diff.removed.find(val => val.title === el.title)))
        this.socket.emit(Flags.TAG_ADD_DOC, new AddTagElementOut(docId, addedTag.title));
      for (const removedTag of diff.removed.filter(el => !diff.added.find(val => val.title == el.title)))
        this.socket.emit(Flags.TAG_REMOVE_DOC, new RemoveTagElementOut(docId, removedTag.title));
    }
    else if (this.data[1] === TabTypes.BLUEPRINT) {
      this.project.updateBlueprintTags(this.data[0], newTags);
      docId = this.project.openBlueprints[this.data[0]].id;

      //Little patch with filter method to avoid repetitions in diff.added and removed
      for (const addedTag of diff.added.filter(el => !diff.removed.find(val => val.title === el.title)))
        this.socket.emit(Flags.TAG_ADD_BLUEPRINT, new AddTagElementOut(docId, addedTag.title));
      for (const removedTag of diff.removed.filter(el => !diff.added.find(val => val.title == el.title)))
        this.socket.emit(Flags.TAG_REMOVE_BLUEPRINT, new RemoveTagElementOut(docId, removedTag.title));
    }
  }
  public tagClick(tagName: string) {
    this.logger.log(tagName);
  }

  get el(): Blueprint | DocumentSock {
    if (this.data[1] === TabTypes.BLUEPRINT)
      return this.project.openBlueprints[this.data[0]];
    else if (this.data[1] === TabTypes.DOCUMENT)
      return this.project.openDocs[this.data[0]];
  }

  get tagNames() {
    return this.project.tags?.map(el => el.title) ?? [];
  }
  get elTags() {
    return this.el.tags ?? [];
  }
  get elTagNames() {
    return this.elTags?.map(el => el.title) ?? [];
  }
  get docTagColors() {
    const map = new Map<string, string>();
    for (const el of this.elTags)
      map.set(el.title, el.color);
    return map;
  }
}
