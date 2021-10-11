import { CreateMainTagComponent } from './../../../../../modals/create-main-tag/create-main-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { EditMainTagComponent } from 'src/app/components/modals/edit-main-tag/edit-main-tag.component';

@Component({
  selector: 'app-search-tag-sort',
  templateUrl: './search-tag-sort.component.html',
  styleUrls: ['./search-tag-sort.component.scss']
})
export class SearchTagSortComponent {

  constructor(
    private readonly dialog: MatDialog
  ) { }

  @Input()
  public tags!: Tag[];

  @Input()
  public selectedTags: Tag[] = [];

  @Output()
  public readonly selectedTagsChange = new EventEmitter<Tag[]>();

  public toggleTag(tag: Tag) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.selectedTagsChange.emit(this.selectedTags);
  }

  public onTagRightClick(e: Event, tag: Tag) {
    e.preventDefault();
    this.dialog.open(EditMainTagComponent, { data: tag });
  }

  public onTagAdd() {
    this.dialog.open(CreateMainTagComponent);
  }
}
