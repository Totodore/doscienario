import { SocketService } from '../../../services/sockets/socket.service';
import { AddTagComponent } from './add-tag/add-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './../../../services/project.service';
import { ITabElement, TabTypes } from './../../../models/tab-element.model';
import { Component } from '@angular/core';
import { diff as arrayDiff } from "fast-array-diff";
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Tag } from 'src/app/models/api/tag.model';
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

  public show: boolean = false;

  public readonly title = "Gestionnaire de tags";
  public readonly type = TabTypes.STANDALONE;

  public addPrimaryTag() {
    this.dialog.open(AddTagComponent);
  }

  public updateTag(tag: Tag) {
    this.dialog.open(AddTagComponent, { data: tag });
  }

  public updateSecondaryTags(newTagNames: string[]) {
    const createdTags = newTagNames.filter(el => !this.project.tags.find(value => el === value.title)).map(el => new Tag(el));
    const newTags = [...this.project.tags.filter(el => newTagNames.includes(el.title)), ...createdTags];
    const oldTags = this.tags;
    const diff = arrayDiff(oldTags, newTags, (a, b) => a.title === b.title);

    // this.project.tags = [...newTags, ...this.primaryTags];

    //Little patch with filter method to avoid repetitions in diff.added and removed
    for (const addedTag of diff.added.filter(el => !diff.removed.find(val => val.title === el.title)))
      this.socket.socket.emit(Flags.CREATE_TAG, addedTag);
    for (const removedTag of diff.removed.filter(el => !diff.added.find(val => val.title == el.title)))
      this.socket.socket.emit(Flags.REMOVE_TAG, removedTag.title);
  }

  public onSecondaryTagClick(tagName: string) {
    const tag = this.tags.find(el => el.title === tagName);
    if (tag)
      this.dialog.open(AddTagComponent, { data: tag });
  }

  get tags(): Tag[] {
    return this.project.tags;
  }
  get tagNames(): string[] {
    return this.tags.map(el => el.title);
  }
  get tagColors(): Map<string, string> {
    const map = new Map<string, string>();
    for (const tag of this.tags)
      map.set(tag.title, tag.color);
    return map;
  }

  get docTags(): Tag[] {
    return Array.from(new Set(this.project.docs
      .reduce<string[]>((prev, curr) => [...prev, ...curr.tags.map(el => el.title)], [])
      .map(el => this.project.tags.find(val => val.title === el))
      .filter(el => el != null)));
  }
  get blueprintTags(): Tag[] {
    return Array.from(new Set(this.project.blueprints
      .reduce<string[]>((prev, curr) => [...prev, ...curr.tags.map(el => el.title)], [])
      .map(el => this.project.tags.find(val => val.title === el))
      .filter(el => el != null)));
  }
}
