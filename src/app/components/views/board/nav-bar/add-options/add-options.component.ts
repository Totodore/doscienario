import { BlueprintComponent } from './../../../../tabs/blueprint/blueprint.component';
import { DocumentComponent } from './../../../../tabs/document/document.component';
import { TabService } from './../../../../../services/tab.service';
import { Component } from '@angular/core';
import { WelcomeTabComponent } from 'src/app/components/tabs/welcome-tab/welcome-tab.component';
import { ProjectService } from 'src/app/services/project.service';
import { ApiService } from 'src/app/services/api.service';
import { ProgressService } from 'src/app/services/ui/progress.service';
import { SnackbarService } from 'src/app/services/ui/snackbar.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-options',
  templateUrl: './add-options.component.html',
  styleUrls: ['./add-options.component.scss']
})
export class AddOptionsComponent {
  constructor(
    private readonly tabs: TabService,
    private readonly api: ApiService,
    private readonly progress: ProgressService,
    private readonly project: ProjectService,
    private readonly snackbar: SnackbarService,
    private readonly logger: NGXLogger,
  ) { }

  createDoc() {
    this.tabs.pushTab(DocumentComponent, false);
  }

  public openMenu() {
    this.tabs.pushTab(WelcomeTabComponent);
  }
  public openBlueprint() {
    this.tabs.pushTab(BlueprintComponent, false);
  }
  public async refresh() {
    this.tabs.closeAllTab();
    this.logger.log(this.project.id);
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
}
