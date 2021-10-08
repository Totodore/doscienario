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
import { DocumentSock } from 'src/app/models/sockets/document-sock.model';

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

  public allowedSecondaryTags: Tag[] = this.tags;

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
    this.needle = query;
    this.results = this.selectedPrimaryTags.length > 0 || this.selectedSecondaryTags.length > 0 ?
      await this.project.searchFromTags([...this.selectedPrimaryTags, ...this.selectedSecondaryTags], this.needle)
      : [...this.project.blueprints, ...this.project.docs].filter(el => el.title?.toLowerCase()?.includes(this.needle?.toLowerCase() || ""));
    this.progress.hide();
  }

  public async filterSecondaryTags() {
    this.allowedSecondaryTags = this.selectedPrimaryTags.length > 0
      ? await this.project.filterSecondaryTags(this.selectedPrimaryTags)
      : this.tags;
  }

  public get tags(): Tag[] {
    return this.project.tags.filter(el => !el.primary) || [];
  }
  public get primaryTags(): Tag[] {
    return this.project.tags.filter(el => el.primary) || [];
  }
}
