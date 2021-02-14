import { Router } from '@angular/router';
import { CreateProjectReq, CreateProjectRes } from './../../models/api/project.model';
import { CreateProjectComponent } from './../utils/create-project/create-project.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from './../../services/snackbar.service';
import { UserDetailsRes, UserProjectsRes } from './../../models/api/user.model';
import { ProgressService } from './../../services/progress.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public data: UserDetailsRes;
  constructor(
    private readonly api: ApiService,
    private readonly progress: ProgressService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) { }

  public async ngOnInit(): Promise<void> {
    this.progress.show();
    try {
      this.data = await this.api.get<UserDetailsRes>("user/me");
    } catch (e) {
      this.snackbar.snack("Impossible de charger les projets !");
      console.error(e);
    } finally {
      this.progress.hide();
    }
  }

  public async createProject() {
    const dialog = this.dialog.open(CreateProjectComponent);
    dialog.componentInstance.onConfirm.subscribe(async (name: string) => {
      dialog.close();
      this.progress.show();
      try {
        const res = await this.api.post<CreateProjectReq, CreateProjectRes>("project", { name });
        this.data.projects.push({
          createdDate: res.createdDate,
          id: res.id,
          name: res.name
        });
      } catch (e) {
        console.error(e);
        this.snackbar.snack("Une erreur est apparue lors de la création du projet");
      } finally {
        this.progress.hide();
      }
    });
  }

  public async openProject(project: UserProjectsRes) {
    this.progress.show();
    try {
      await this.api.openProject(project.id);
      this.router.navigateByUrl("/");
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Impossible de charger le projet");
    } finally {
      this.progress.hide();
    }
  }

}
