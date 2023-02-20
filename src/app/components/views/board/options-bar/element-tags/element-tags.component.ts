import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMainTagComponent } from 'src/app/components/modals/edit-main-tag/edit-main-tag.component';
import { EditTagsComponent } from 'src/app/components/modals/edit-tags/edit-tags.component';
import { DocumentComponent } from 'src/app/components/tabs/document/document.component';
import { Tag } from 'src/app/models/api/tag.model';
import { Element } from 'src/app/models/default.model';
import { TabTypes } from 'src/app/models/sys/tab.model';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from 'src/app/services/tab.service';

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
    private readonly tabs: TabService,
  ) { }

  public onTagClick(tag: Tag) {
    this.project.searchComponent.tagSortComponent.toggleTag?.(tag);
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

  get doc(): Element {
    if (this.tabType === TabTypes.BLUEPRINT)
      return this.project.openBlueprints[this.tabId];
    else if (this.tabType === TabTypes.DOCUMENT)
      return this.tabs.getTabFromId<DocumentComponent>(this.tabId).doc;
  }

  get docTags(): Tag[] {
    const tagIds = this.doc.tags.map(el => el.id);
    return this.project.tags.filter(el => tagIds.includes(el.id));
  }

}
