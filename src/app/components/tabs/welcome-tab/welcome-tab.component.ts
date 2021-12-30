import { AskTextareaComponent } from './../../utils/ask-textarea/ask-textarea.component';
import { MatDialog } from '@angular/material/dialog';
import { TabTypes } from './../../../models/tab-element.model';
import { SnackbarService } from './../../../services/snackbar.service';
import { ApiService } from './../../../services/api.service';
import { ProgressService } from './../../../services/progress.service';
import { TagsManagerComponent } from './../tags-manager/tags-manager.component';
import { ProjectOptionsComponent } from '../project-options/project-options.component';
import { TabService } from '../../../services/tab.service';
import { ITabElement } from '../../../models/tab-element.model';
import { ProjectService } from '../../../services/project.service';
import { Component, Input } from '@angular/core';
import { version } from "../../../../../package.json";
import { NGXLogger } from 'ngx-logger';
@Component({
  selector: 'app-welcome-tab',
  templateUrl: './welcome-tab.component.html',
  styleUrls: ['./welcome-tab.component.scss']
})
export class WelcomeTabComponent implements ITabElement {

  public readonly title = "Menu";
  public readonly type = TabTypes.STANDALONE;
  @Input() public show: boolean = false;

  constructor(
    public readonly project: ProjectService,
    public readonly tabService: TabService,
    private readonly progress: ProgressService,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialog,
    private readonly logger: NGXLogger,
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

  public async bugReport() {
    const dialog = this.dialog.open(AskTextareaComponent, { data: { title: "Rapport de bug", label: "Décrivez le bug" } });
    dialog.componentInstance.onConfirm.subscribe(async (data: string) => {
      dialog.close();
      try {
        await this.api.bugReport(data);
        this.logger.log("Bug report sent !");
        this.snackbar.snack("Rapport de bug envoyé !");
      } catch (e) {
        this.snackbar.snack("Erreur lors de la soumission du rapport de bug !");
        this.logger.error("Impossible to send bug report", e);
      }
    });
  }
  public async exit() {
    this.tabService.closeAllTab();
    this.project.exit();
  }

  public get version() {
    return version;
  }
}
