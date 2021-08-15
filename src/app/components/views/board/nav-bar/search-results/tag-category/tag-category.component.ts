import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Blueprint } from 'src/app/models/sockets/blueprint-sock.model';
import { TagTree } from 'src/app/models/tag.model';
import { Document } from 'src/app/models/api/project.model';
import { DataType } from 'src/app/models/default.model';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { TabService } from 'src/app/services/tab.service';
import { BlueprintComponent } from 'src/app/components/tabs/blueprint/blueprint.component';
import { DocumentComponent } from 'src/app/components/tabs/document/document.component';

@Component({
  selector: 'app-tag-category',
  templateUrl: './tag-category.component.html',
  styleUrls: ['./tag-category.component.scss']
})
export class TagCategoryComponent {

  @Input()
  public tree!: TagTree;

  @Output()
  public readonly searchQuery = new EventEmitter<string>();

  constructor(
    private readonly tabs: TabService,
  ) { }


  public get children(): (Document | Blueprint)[] {
    return this.tree.els.sort((a, b) => a.lastEditing?.getTime() - b.lastEditing?.getTime()).slice(0, 5);
  }

  public getIconName(el: Document | Blueprint | Tag): string {
    if (el.type === DataType.Blueprint)
      return "account_tree";
    else if (el.type === DataType.Tag)
      return "tag";
    else
      return "description";
  }

  public openEl(el: Document | Tag | Blueprint) {
    console.log(el);
    if (el.type === DataType.Tag) {
      this.searchQuery.emit('#' + el.name);
    } else if (el.type === DataType.Blueprint)
      this.tabs.pushTab(BlueprintComponent, true, el.id);
    else if (el.type === DataType.Document)
      this.tabs.pushTab(DocumentComponent, true, el.id);
  }

}
