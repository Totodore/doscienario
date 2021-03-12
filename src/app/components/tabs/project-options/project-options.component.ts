import { ConfirmComponent } from './../../utils/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from './../../../services/snackbar.service';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from './../../../services/socket.service';
import { ProjectService } from '../../../services/project.service';
import { ITabElement } from '../../../models/tab-element.model';
import { ChangeDetectionStrategy, Component, OnInit, Provider, Type, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styleUrls: ['./project-options.component.scss']
})
export class ProjectOptionsComponent implements ITabElement {

  constructor(
    public readonly project: ProjectService,
    public readonly socket: SocketService,
    public readonly api: ApiService,
    public readonly snackbar: SnackbarService,
    public readonly dialog: MatDialog
  ) { }

  public title: string = "Options";
  public show: boolean = true;

  public name: string = this.project.name;

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

  public deleteProject() {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer le projet ?" });
    dialog.componentInstance.confirm.subscribe(async () => {
      dialog.close();
      try {
        await this.api.delete(`project/${this.project.id}`);
        this.project.exit();
      } catch (e) {
        console.error(e);
        this.snackbar.snack("Erreur lors de la suppression du projet");
      }
    });
  }

}
