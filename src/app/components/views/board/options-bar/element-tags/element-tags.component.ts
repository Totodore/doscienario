import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMainTagComponent } from 'src/app/components/modals/edit-main-tag/edit-main-tag.component';
import { EditTagsComponent } from 'src/app/components/modals/edit-tags/edit-tags.component';
import { DocumentSock } from 'src/app/models/sockets/document-sock.model';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { TabTypes } from 'src/app/models/tab-element.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-element-tags',
  templateUrl: './element-tags.component.html',
  styleUrls: ['./element-tags.component.scss']
})
export class ElementTagsComponent {

  @Input()
  public tabId: string;

  @Input()
  public tabType: TabTypes;

  constructor(
    private readonly project: ProjectService,
    private readonly dialog: MatDialog,
  ) { }

  public onTagClick(tag: Tag) {
    this.project.toggleTag?.(tag);
  }
  public onTagRightClick(e: Event, tag: Tag) {
    e.preventDefault();
    this.dialog.open(EditMainTagComponent, { data: tag });
  }

  public openTagEdit() {
    this.dialog.open(EditTagsComponent, {
      data: [this.tabId, this.tabType],
      width: "600px",
      maxWidth: "90%",
      maxHeight: "90%"
    });
  }

  get doc(): DocumentSock {
    return this.project.openDocs[this.tabId];
  }

  get docTags(): Tag[] {
    const tagIds = this.doc.tags.map(el => el.id);
    return this.project.tags.filter(el => tagIds.includes(el.id));
  }

}
