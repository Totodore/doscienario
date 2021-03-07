import { SnackbarService } from './../../../services/snackbar.service';
import { ApiService } from './../../../services/api.service';
import { ProgressService } from './../../../services/progress.service';
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
    public readonly tabService: TabService,
    private readonly progress: ProgressService,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }

  public openSettings() {
    this.tabService.pushTab(ProjectOptionsComponent);
  }

  public openTags() {
    this.tabService.pushTab(TagsManagerComponent);
  }
  public async reSync() {
    this.tabService.closeAllTab();
    try {
      this.progress.show();
      await this.api.openProject(this.project.id);
      this.snackbar.snack("Projet re-synchronisé !");
    } catch (e) {
      this.snackbar.snack("Erreur lors de la re-synchronisation !");
    } finally {
      this.progress.hide();
    }
  }
  public async exit() {
    this.tabService.closeAllTab();
    this.project.exit();
  }
}
