import { DbService } from './../../../services/database/db.service';
import { TabService } from './../../../services/tab.service';
import { ConfirmComponent } from './../../utils/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/ui/snackbar.service';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from '../../../services/sockets/socket.service';
import { ProjectService } from '../../../services/project.service';
import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ITabElement, Tab, TabTypes } from 'src/app/models/sys/tab.model';

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styleUrls: ['./project-options.component.scss']
})
export class ProjectOptionsComponent implements ITabElement {

  constructor(
    private readonly tabs: TabService,
    private readonly logger: NGXLogger,
    private readonly db: DbService,
    public readonly project: ProjectService,
    public readonly socket: SocketService,
    public readonly api: ApiService,
    public readonly snackbar: SnackbarService,
    public readonly dialog: MatDialog,
  ) { }

  public title: string = "Options";
  public show: boolean = true;

  public name: string = this.project.name;

  public readonly type = TabTypes.STANDALONE;

  public updateName() {
    this.socket.updateProject(this.name);
  }

  public async exportProject() {
    const id = (await this.api.get<{ id: string }>(`project/${this.project.id}/export`)).id;
    if (id)
      location.href = `${this.api.root}/res/exported-data/${id}`;
    else
      this.snackbar.snack("Erreur lors de l'export du projet");
  }

  public async clearTabs() {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Vider les onglets de tous les projets ?" });
    dialog.componentInstance.confirm.subscribe(async () => {
      dialog.close();
      try {
        await this.db.clear(Tab);
        this.tabs.closeAllTab();
        localStorage.removeItem("tabs");
      } catch (e) {
        this.logger.error(e);
        this.snackbar.snack("Erreur lors de la suppression des onglets");
      }
    });
  }

  public deleteProject() {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer le projet ?" });
    dialog.componentInstance.confirm.subscribe(async () => {
      dialog.close();
      try {
        await this.api.delete(`project/${this.project.id}`);
        this.tabs.closeAllTab();
        localStorage.removeItem("tabs");
        this.project.exit();
      } catch (e) {
        this.logger.error(e);
        this.snackbar.snack("Erreur lors de la suppression du projet");
      }
    });
  }

}
