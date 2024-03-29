import { Router } from '@angular/router';
import { CreateProjectReq, Project, User } from '../../../models/api/project.model';
import { AskInputComponent } from '../../utils/ask-input/ask-input.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/ui/snackbar.service';
import { UserProjectsRes } from '../../../models/api/user.model';
import { ProgressService } from '../../../services/ui/progress.service';
import { ApiService } from '../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public data: User;
  constructor(
    private readonly api: ApiService,
    private readonly progress: ProgressService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly logger: NGXLogger,
  ) { }

  public async ngOnInit(): Promise<void> {
    this.progress.show();
    this.logger.log("Loading user data and projects");
    try {
      this.data = await this.api.get<User>("user/me");
      localStorage.setItem("me", JSON.stringify(this.data));
      this.progress.hide();
    } catch (e) {
      this.snackbar.snack("Impossible de charger les projets !");
      this.logger.error("Impossible to load user data and projects", e);
      this.progress.hide();
    }
  }

  public async createProject() {
    const dialog = this.dialog.open(AskInputComponent, { data: "Créer un nouveau projet" });
    dialog.componentInstance.onConfirm.subscribe(async (name: string) => {
      dialog.close();
      this.progress.show();
      try {
        const res = await this.api.post<CreateProjectReq, Project>("project", { name });
        this.data.projects.push(new Project(res));
        this.progress.hide();
      } catch (e) {
        this.logger.error(e);
        this.snackbar.snack("Une erreur est apparue lors de la création du projet");
        this.progress.hide();
      }
    });
  }
  public async importProject(input: HTMLInputElement) {
    if (input.files[0]) {
      if (await this.api.importProject(input.files[0])) {
        this.snackbar.snack("Projet importé avec succès");
        await this.ngOnInit();
      } else {
        this.snackbar.snack("Erreur lors de l'import du projet");
      }
    }
  }

  public async openProject(project: UserProjectsRes) {
    this.progress.show();
    try {
      await this.api.openProject(project.id);
      this.router.navigateByUrl("/");
    } catch (e) {
      this.logger.error(e);
      this.snackbar.snack("Impossible de charger le projet");
    } finally {
      this.progress.hide();
    }
  }
  public logout() {
    const user = this.api.user.name;
    if (this.api.logout()) {
      this.router.navigateByUrl("/auth");
      this.snackbar.snack(`Au revoir ${user} !`);
    } else
      this.snackbar.snack("Erreur lors de la deconnexion !");
  }

}
