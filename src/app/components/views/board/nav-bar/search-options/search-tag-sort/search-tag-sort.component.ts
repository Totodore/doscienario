import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from 'src/app/models/sockets/tag-sock.model';

@Component({
  selector: 'app-search-tag-sort',
  templateUrl: './search-tag-sort.component.html',
  styleUrls: ['./search-tag-sort.component.scss']
})
export class SearchTagSortComponent {

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
}
