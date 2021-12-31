
import { ProjectService } from '../../../../../services/project.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ProgressService } from 'src/app/services/ui/progress.service';
import { Element } from 'src/app/models/default.model';
import { Tag } from 'src/app/models/api/tag.model';
import { SearchTagSortComponent } from './search-tag-sort/search-tag-sort.component';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {

  public needle = "";

  @Output()
  public readonly searchQueryChange = new EventEmitter<string>();

  public selectedTags: Tag[] = [];

  public allowedTags: Tag[] = this.tags;

  public results: Element[] = [];

  @ViewChild(SearchTagSortComponent)
  public tagSortComponent!: SearchTagSortComponent;

  constructor(
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
  ) { 
    this.project.searchComponent = this;
  }

  public ngOnInit() {
    this.search();
  }

  public async search(query?: string) {
    this.progress.show();
    this.needle = query;
    this.results = this.selectedTags.length > 0 ?
      await this.project.searchFromTags(this.selectedTags, this.needle)
      : [...this.project.blueprints, ...this.project.docs]
        .filter(el => el.title?.toLowerCase()?.includes(this.needle?.toLowerCase() || ""))
        .sort((a, b) => a.title?.toLowerCase() < b.title?.toLowerCase() ? -1 : 1);
    this.progress.hide();
  }

  public async filterSecondaryTags() {
    this.allowedTags = this.selectedTags.length > 0
      ? await this.project.filterSecondaryTags(this.selectedTags)
      : this.tags;
  }

  public get tags(): Tag[] {
    return this.project.tags || [];
  }
}
