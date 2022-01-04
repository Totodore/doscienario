import { CreateMainTagComponent } from './../../../../../modals/create-main-tag/create-main-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditMainTagComponent } from 'src/app/components/modals/edit-main-tag/edit-main-tag.component';
import { Tag } from 'src/app/models/api/tag.model';

@Component({
  selector: 'app-search-tag-sort',
  templateUrl: './search-tag-sort.component.html',
  styleUrls: ['./search-tag-sort.component.scss']
})
export class SearchTagSortComponent {

  constructor(
    private readonly dialog: MatDialog,
  ) { }

  @Input()
  public tags!: Tag[];

  @Input()
  public selectedTags: Tag[] = [];

  @Output()
  public readonly selectedTagsChange = new EventEmitter<Tag[]>();

  @Output()
  public readonly selectedNoTagChange = new EventEmitter<boolean>();

  @Input()
  public selectedNoTag = false;

  public toggleTag(tag: Tag) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.selectedTagsChange.emit(this.selectedTags);
  }

  public unSelectTag(tag: Tag) {
    const index = this.selectedTags.indexOf(tag);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
      this.selectedTagsChange.emit(this.selectedTags);
    }
  }

  public onTagRightClick(e: Event, tag: Tag) {
    e.preventDefault();
    this.dialog.open(EditMainTagComponent, { data: tag });
  }

  public onTagAdd() {
    this.dialog.open(CreateMainTagComponent);
  }

  public onUnselectAllTags() {
    this.selectedTags = [];
    this.selectedNoTag = false;
    this.selectedTagsChange.emit(this.selectedTags);
    this.selectedNoTagChange.emit(false);
  }

  public onToggleNoTags() {
    this.selectedNoTag = !this.selectedNoTag;
    this.selectedNoTagChange.emit(this.selectedNoTag);
  }

  public get hasSelectedTags() {
    return this.selectedTags.length > 0 || this.selectedNoTag;
  }
}
