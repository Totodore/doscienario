import { BlueprintService } from './../../../../../services/blueprint.service';
import { Blueprint, RenameBlueprintOut } from './../../../../../models/sockets/blueprint-sock.model';
import { ConfirmComponent } from './../../../../utils/confirm/confirm.component';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { DocumentModel } from './../../../../../models/sockets/document-sock.model';
import { MatDialog } from '@angular/material/dialog';
import { SocketService } from './../../../../../services/socket.service';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from './../../../../../services/tab.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { RenameDocumentReq } from 'src/app/models/sockets/document-sock.model';
import { EditTagsComponent } from 'src/app/components/utils/edit-tags/edit-tags.component';

@Component({
  selector: 'app-blueprint-options',
  templateUrl: './blueprint-options.component.html',
  styleUrls: ['./blueprint-options.component.scss']
})
export class BlueprintOptionsComponent {

  constructor(
    private readonly tabs: TabService,
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly dialog: MatDialog,
    private readonly blueprintHandler: BlueprintService
  ) { }

  onRename() {
    this.project.renameBlueprint(this.tabId, this.blueprint.name);
    this.socket.socket.emit(Flags.RENAME_BLUEPRINT, new RenameBlueprintOut(this.blueprintId, this.blueprint.name));
  }
  openTagEdit() {
    this.dialog.open(EditTagsComponent, {
      data: this.tabId,
      width: "600px",
      maxWidth: "90%",
      maxHeight: "90%"
    });
  }

  autoPosBlueprint() {
    this.blueprintHandler.autoPos();
  }

  deleteBlueprint() {
    const dialog = this.dialog.open(ConfirmComponent, {
      data: "Supprimer l'arbre ?"
    });
    dialog.componentInstance.confirm.subscribe(() => {
      dialog.close();
      this.socket.socket.emit(Flags.REMOVE_BLUEPRINT, this.blueprintId);
      this.project.removeBlueprint(this.tabId);
      this.tabs.removeTab();
    });
  }

  get blueprint(): Blueprint {
    return this.project.openBlueprints[this.tabId];
  }
  get blueprintId(): number {
    return this.tabs.displayedTab[1].id;
  }
  get docTags(): Tag[] {
    const tagIds = this.blueprint.tags?.map(el => el.id);
    return this.project.tags.filter(el => tagIds?.includes(el.id));
  }
  get tabId(): string {
    return this.tabs.displayedTab[1].tabId;
  }
}
