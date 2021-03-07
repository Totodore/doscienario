import { ProgressService } from './../../../services/progress.service';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from './../../../services/socket.service';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { AddTagComponent } from './add-tag/add-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './../../../services/project.service';
import { ITabElement } from './../../../models/tab-element.model';
import { ChangeDetectionStrategy, Component, OnInit, Provider, Type, ViewEncapsulation } from '@angular/core';
import { diff as arrayDiff } from "fast-array-diff";
import { Flags } from 'src/app/models/sockets/flags.enum';
@Component({
  selector: 'app-tags-manager',
  templateUrl: './tags-manager.component.html',
  styleUrls: ['./tags-manager.component.scss']
})
export class TagsManagerComponent implements ITabElement {

  constructor(
    private readonly project: ProjectService,
    private readonly dialog: MatDialog,
    private readonly socket: SocketService,
  ) { }

  title: string = "Gestionnaire de tags";
  show: boolean = false;

  public addPrimaryTag() {
    this.dialog.open(AddTagComponent);
  }

  public updateTag(tag: Tag) {
    this.dialog.open(AddTagComponent, { data: tag });
  }

  public updateSecondaryTags(newTagNames: string[]) {
    const createdTags = newTagNames.filter(el => !this.project.tags.find(value => el === value.name)).map(el => new Tag(el));
    const newTags = [...this.project.tags.filter(el => newTagNames.includes(el.name)), ...createdTags];
    const oldTags = this.secondaryTags;
    const diff = arrayDiff(oldTags, newTags, (a, b) => a.name === b.name);

    this.project.tags = [...newTags, ...this.primaryTags];

    //Little patch with filter method to avoid repetitions in diff.added and removed
    for (const addedTag of diff.added.filter(el => !diff.removed.find(val => val.name === el.name)))
      this.socket.socket.emit(Flags.CREATE_TAG, addedTag);
    for (const removedTag of diff.removed.filter(el => !diff.added.find(val => val.name == el.name)))
      this.socket.socket.emit(Flags.REMOVE_TAG, removedTag.name);
  }

  public onSecondaryTagClick(tagName: string) {
    const tag = this.secondaryTags.find(el => el.name === tagName);
    if (tag)
      this.dialog.open(AddTagComponent, { data: tag });
  }

  get primaryTags(): Tag[] {
    return this.project.tags.filter(el => el.primary);
  }

  get secondaryTags(): Tag[] {
    return this.project.tags.filter(el => !el.primary);
  }
  get secondaryTagNames(): string[] {
    return this.secondaryTags.map(el => el.name);
  }
  get secondaryTagColors(): Map<string, string> {
    const map = new Map<string, string>();
    for (const tag of this.secondaryTags)
      map.set(tag.name, tag.color);
    return map;
  }

  get docTags(): Tag[] {
    return this.project.docs
      .reduce<string[]>((prev, curr) => [...prev, ...curr.tags.map(el => el.name)], [])
      .map(el => this.project.tags.find(val => val.name === el))
      .filter(el => el != null && !el.primary);
  }
}
