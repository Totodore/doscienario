import { WelcomeTabComponent } from './../../tabs/welcome-tab/welcome-tab.component';
import { MenuComponent } from './../menu/menu.component';
import { BlueprintComponent } from './../../tabs/blueprint/blueprint.component';
import { TabService } from './../../../services/tab.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProgressService } from './../../../services/progress.service';
import { ApiService } from './../../../services/api.service';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { SocketService } from './../../../services/socket.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { DocumentComponent } from '../../tabs/document/document.component';
import { B, M, N, W } from '@angular/cdk/keycodes';
import { TabTypes } from 'src/app/models/tab-element.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {


  constructor(
    private readonly socket: SocketService,
    private readonly snackbar: MatSnackBar,
    private readonly api: ApiService,
    private readonly progress: ProgressService,
    private readonly project: ProjectService,
    private readonly tabs: TabService
  ) { }

  async ngOnInit(): Promise<void> {
    this.socket.connect();
    let snack: MatSnackBarRef<TextOnlySnackBar>;
    try {
      this.progress.show();
      snack = this.snackbar.open("Synchronisation du projet...", null, { duration: null });
      await this.api.openProject(this.project.id);
      this.tabs.loadSavedTabs(this.project.id);
      this.snackbar.open("Project synchronisé avec succès !", null, { duration: 3000 });
    } catch (e) {
      console.error(e);
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
      default:
        break;
    }
  }

  public get showOptions() {
    return this.tabs.displayedTab?.[1]?.type === TabTypes.BLUEPRINT || this.tabs.displayedTab?.[1]?.type === TabTypes.DOCUMENT;
  }
}
