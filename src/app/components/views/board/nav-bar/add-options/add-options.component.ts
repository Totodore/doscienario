import { SocketService } from 'src/app/services/sockets/socket.service';
import { SearchOptionsComponent } from './../search-options/search-options.component';
import { BlueprintComponent } from './../../../../tabs/blueprint/blueprint.component';
import { DocumentComponent } from './../../../../tabs/document/document.component';
import { TabService } from './../../../../../services/tab.service';
import { Component, Input } from '@angular/core';
import { WelcomeTabComponent } from 'src/app/components/tabs/welcome-tab/welcome-tab.component';
import { ProjectService } from 'src/app/services/project.service';
import { ApiService } from 'src/app/services/api.service';
import { ProgressService } from 'src/app/services/ui/progress.service';
import { SnackbarService } from 'src/app/services/ui/snackbar.service';
import { NGXLogger } from 'ngx-logger';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { AddTagElementOut } from 'src/app/models/sockets/out/tag.out';
import { ElementComponent } from 'src/app/components/tabs/element.component';
import { TabTypes } from 'src/app/models/tab-element.model';
import { Tag } from 'src/app/models/api/tag.model';

@Component({
  selector: 'app-add-options',
  templateUrl: './add-options.component.html',
  styleUrls: ['./add-options.component.scss']
})
export class AddOptionsComponent {
  
  @Input()
  public searchComponent: SearchOptionsComponent;
  
  constructor(
    private readonly tabs: TabService,
    private readonly api: ApiService,
    private readonly progress: ProgressService,
    private readonly project: ProjectService,
    private readonly snackbar: SnackbarService,
    private readonly logger: NGXLogger,
    private readonly socket: SocketService
  ) { }

  public createDoc() {
    const tabId = this.tabs.pushTab(DocumentComponent, false);
    this.addElementTag(tabId);
  }

  public openMenu() {
    this.tabs.pushTab(WelcomeTabComponent);
  }
  public openBlueprint() {
    const tabId = this.tabs.pushTab(BlueprintComponent, false);
    this.addElementTag(tabId);
  }

  public async refresh() {
    this.tabs.closeAllTab();
    this.logger.log("Trying to refresh project", this.project.id);
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

  private async addElementTag(tabId: string) {
    if (this.searchComponent.selectedTags?.length > 0) {
      const el = this.tabs.getTabFromId<ElementComponent>(tabId);
      await el.addTags(this.searchComponent.selectedTags);
    }
  }
}
