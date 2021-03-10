import { TabService } from './../../../services/tab.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProgressService } from './../../../services/progress.service';
import { ApiService } from './../../../services/api.service';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { SocketService } from './../../../services/socket.service';
import { Component, OnInit } from '@angular/core';

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
      this.tabs.loadSavedTabs();
      this.snackbar.open("Project synchronisé avec succès !", null, { duration: 3000 });
    } catch (e) {
      console.error(e);
      this.snackbar.open("Impossible de synchroniser le projet...", null, { duration: 3000 });
    } finally {
      this.progress.hide();
      snack.dismiss();
    }
  }


}
