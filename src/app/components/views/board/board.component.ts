import { WelcomeTabComponent } from './../../tabs/welcome-tab/welcome-tab.component';
import { BlueprintComponent } from './../../tabs/blueprint/blueprint.component';
import { TabService } from './../../../services/tab.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProgressService } from '../../../services/ui/progress.service';
import { ApiService } from './../../../services/api.service';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { SocketService } from '../../../services/sockets/socket.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { DocumentComponent } from '../../tabs/document/document.component';
import { B, M, N, TAB, W } from '@angular/cdk/keycodes';
import { NGXLogger } from 'ngx-logger';
import { TabTypes } from 'src/app/models/sys/tab.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {



  public get openOptions() { return localStorage.getItem("openOptions") !== "false"; }
  public set openOptions(value: boolean) { localStorage.setItem("openOptions", value.toString()); }
  public get openNav() { return localStorage.getItem("openNav") !== "false"; }
  public set openNav(value: boolean) { localStorage.setItem("openNav", value.toString()); }
  constructor(
    private readonly socket: SocketService,
    private readonly snackbar: MatSnackBar,
    private readonly api: ApiService,
    private readonly progress: ProgressService,
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    private readonly logger: NGXLogger,
  ) { }

  async ngOnInit(): Promise<void> {
    this.socket.connect();
    let snack: MatSnackBarRef<TextOnlySnackBar>;
    try {
      this.progress.show();
      snack = this.snackbar.open("Synchronisation du projet...", null, { duration: null });
      this.logger.log("Opening project:", this.project.id);
      await this.api.openProject(this.project.id);
      this.tabs.loadSavedTabs(this.project.id);
      this.logger.log("Project opened:", this.project.id, this.project.name);
      this.snackbar.open("Project synchronisé avec succès !", null, { duration: 3000 });
    } catch (e) {
      this.logger.error("Impossible to open project:", this.project.id, e);
      this.snackbar.open("Impossible de synchroniser le projet...", null, { duration: 3000 });
    } finally {
      this.progress.hide();
      snack.dismiss();
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onCtrlKeyDown(e: KeyboardEvent) {
    if (!e.ctrlKey)
      return;
    switch (e.keyCode) {
      case W:
        e.preventDefault();
        e.stopImmediatePropagation();
        this.tabs.removeTab();
        break;
      case N:
        e.preventDefault();
        e.stopImmediatePropagation();
        this.tabs.pushTab(DocumentComponent, false, null);
        break;
      case B:
        e.preventDefault();
        e.stopImmediatePropagation();
        this.tabs.pushTab(BlueprintComponent, false, null);
        break;
      case M:
        e.preventDefault();
        e.stopImmediatePropagation();
        this.tabs.pushTab(WelcomeTabComponent);
        break;
      case TAB:
        if (e.ctrlKey) {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.tabs.showNextTab();
        }
        break;
      default:
        break;
    }
  }

  public get showOptions() {
    return this.tabs.displayedTab?.[1]?.type === TabTypes.BLUEPRINT || this.tabs.displayedTab?.[1]?.type === TabTypes.DOCUMENT;
  }
}
