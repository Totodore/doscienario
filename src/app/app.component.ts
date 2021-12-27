
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProgressService } from './services/progress.service';
import { ApiService } from './services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from './components/utils/info/info.component';
import { version } from '../../package.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public isCompatible = false;

  constructor(
    public readonly progress: ProgressService,
    private readonly api: ApiService,
    private readonly dialog: MatDialog,
    private readonly changeDetector: ChangeDetectorRef
  ) { }

  public async ngOnInit() {
    this.progress.changeDetector = this.changeDetector;
    const res = await this.api.checkApiVersion();
    this.isCompatible = res === true;
    if (res !== true) {
      this.dialog.open(InfoComponent, {
        data: {
          text: `Une mise à jour est requise pour continuer à utiliser Doscienario`,
          content: `Vous devez posséder une des versions suivantes : ${res.join(", ")}. Version actuelle : ${version}`,
          closable: false
        },
        closeOnNavigation: false,
        disableClose: true
      });
    }
  }
}
