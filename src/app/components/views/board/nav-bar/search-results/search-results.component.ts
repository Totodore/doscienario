import { BlueprintComponent } from './../../../../tabs/blueprint/blueprint.component';
import { Blueprint } from './../../../../../models/sockets/blueprint-sock.model';
import { DocumentComponent } from '../../../../tabs/document/document.component';
import { TabService } from '../../../../../services/tab.service';
import { Document } from '../../../../../models/api/project.model';
import { Tag } from '../../../../../models/sockets/tag-sock.model';
import { ProjectService } from '../../../../../services/project.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataType } from 'src/app/models/default.model';
import { ProgressService } from 'src/app/services/progress.service';
import { TagTree } from 'src/app/models/tag.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnChanges {

  @Input()
  public searchQuery = '';

  @Output()
  public readonly searchQueryChange = new EventEmitter<string>();

  public tagTree: TagTree[];

  constructor(
    private readonly tabs: TabService,
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery'])
      this.search(this.searchQuery);
  }

  public ngOnInit() {
    this.project.updateSearch = val => {
      this.searchQueryChange.emit(val);
      this.search(val);
    };
    this.search();
  }

  private async search(query?: string) {
    this.progress.show();
    this.tagTree = await this.project.getTagTree(query);
    this.progress.hide();
  }

  public openEl(el: Document | Tag | Blueprint) {
    console.log(el);
    if (el.type === DataType.Tag) {
      this.searchQuery = "#" + el.name;
      this.searchQueryChange.emit(this.searchQuery);
    } else if (el.type === DataType.Blueprint)
      this.tabs.pushTab(BlueprintComponent, true, el.id);
    else if (el.type === DataType.Document)
      this.tabs.pushTab(DocumentComponent, true, el.id);
  }
  public getIconName(el: Document | Blueprint | Tag): string {
    if (el.type === DataType.Blueprint)
      return "account_tree";
    else if (el.type === DataType.Tag)
      return "tag";
    else
      return "description";
  }
  public get tags(): Tag[] {
    return this.project.tags.filter(el => !el.primary) || [];
  }
  public get noTagEls(): (Document | Blueprint)[] {
    const showedEls = this.tagTree.reduce((prev, curr) => [...prev, ...curr.els], []).map(el => el.id);
    return [...this.project.docs, ...this.project.blueprints].filter(el =>
      !showedEls.includes(el.id)
        && ((el as Blueprint)?.name || (el as Document)?.title).toLowerCase().includes(this.searchQuery?.toLowerCase() || ''));
  }
}
