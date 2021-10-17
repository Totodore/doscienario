import { TabService } from '../../../../../services/tab.service';
import { ProjectService } from '../../../../../services/project.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProgressService } from 'src/app/services/progress.service';
import { Element } from 'src/app/models/default.model';
import { Tag } from 'src/app/models/api/tag.model';

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

  constructor(
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
    this.needle = query;
    this.results = this.selectedTags.length > 0 ?
      await this.project.searchFromTags(this.selectedTags, this.needle)
      : [...this.project.blueprints, ...this.project.docs]
        .filter(el => el.title?.toLowerCase()?.includes(this.needle?.toLowerCase() || ""));
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
