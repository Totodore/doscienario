import { TagsManagerComponent } from './../tags-manager/tags-manager.component';
import { ProjectOptionsComponent } from '../project-options/project-options.component';
import { TabService } from '../../../services/tab.service';
import { ITabElement } from '../../../models/tab-element.model';
import { ProjectService } from '../../../services/project.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-tab',
  templateUrl: './welcome-tab.component.html',
  styleUrls: ['./welcome-tab.component.scss']
})
export class WelcomeTabComponent {

  constructor(
    public readonly project: ProjectService,
    public readonly tabService: TabService
  ) { }

  public openSettings() {
    this.tabService.pushTab(ProjectOptionsComponent);
  }

  public openTags() {
    this.tabService.pushTab(TagsManagerComponent);
  }
}
