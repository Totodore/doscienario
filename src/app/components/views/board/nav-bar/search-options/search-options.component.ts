import { BlueprintComponent } from './../../../../tabs/blueprint/blueprint.component';
import { Blueprint } from './../../../../../models/sockets/blueprint-sock.model';
import { DocumentComponent } from '../../../../tabs/document/document.component';
import { TabService } from '../../../../../services/tab.service';
import { Document } from '../../../../../models/api/project.model';
import { Tag } from '../../../../../models/sockets/tag-sock.model';
import { ProjectService } from '../../../../../services/project.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataType, ElementModel } from 'src/app/models/default.model';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {

  public needle = "";

  @Output()
  public readonly searchQueryChange = new EventEmitter<string>();

  public selectedPrimaryTags: Tag[] = [];
  public selectedSecondaryTags: Tag[] = [];

  public results: ElementModel[] = [];

  constructor(
    private readonly tabs: TabService,
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
  ) { }

  public ngOnInit() {
    this.project.updateSearch = val => {
      this.search(val);
    };
    this.search();
  }

  public async search(query?: string) {
    this.progress.show();
    this.results = query ?
      await this.project.searchFromTags([...this.selectedPrimaryTags, ...this.selectedSecondaryTags], this.needle)
      : [];
    this.progress.hide();
  }

  public openEl(el: Document | Tag | Blueprint) {
    if (el.type === DataType.Tag) {
      this.needle = "#" + el.name;
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
  public get primaryTags(): Tag[] {
    return this.project.tags.filter(el => el.primary) || [];
  }
}
