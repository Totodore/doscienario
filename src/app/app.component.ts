import { NGXLogger } from 'ngx-logger';
import { ElectronService } from 'src/app/services/electron.service';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProgressService } from './services/ui/progress.service';
import { ApiService } from './services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from './components/utils/info/info.component';
import { version } from '../../package.json';
import { ContextMenuService } from './services/ui/context-menu.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public isCompatible = false;

  constructor(
    public readonly progress: ProgressService,
    public readonly contextMenu: ContextMenuService,
    private readonly api: ApiService,
    private readonly dialog: MatDialog,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly electron: ElectronService,
    private readonly logger: NGXLogger,
  ) { }

  public async ngOnInit() {
    if (this.electron.isElectronApp)
      this.logger.log("Electron app bundle detected");
    this.progress.changeDetector = this.changeDetector;
    const res = await this.api.checkApiVersion();
    this.isCompatible = res.allowed;
    if (!res.allowed) {
      this.dialog.open(InfoComponent, {
        data: {
          text: `Une mise à jour est requise pour continuer à utiliser Doscienario`,
          content: `Vous devez posséder une des versions suivantes : ${res.versions.join(", ")}. Version actuelle : ${version}`,
          closable: false
        },
        closeOnNavigation: false,
        disableClose: true
      });
    }
  }
}
