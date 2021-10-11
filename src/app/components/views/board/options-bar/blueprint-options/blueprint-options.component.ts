import { TabTypes } from '../../../../../models/tab-element.model';
import { Blueprint, RenameBlueprintOut } from '../../../../../models/sockets/blueprint-sock.model';
import { ConfirmComponent } from '../../../../utils/confirm/confirm.component';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { DocumentSock } from '../../../../../models/sockets/document-sock.model';
import { MatDialog } from '@angular/material/dialog';
import { SocketService } from '../../../../../services/sockets/socket.service';
import { ProjectService } from 'src/app/services/project.service';
import { TabService } from '../../../../../services/tab.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { RenameDocumentReq } from 'src/app/models/sockets/document-sock.model';
import { EditTagsComponent } from 'src/app/components/modals/edit-tags/edit-tags.component';
import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { BlueprintComponent } from 'src/app/components/tabs/blueprint/blueprint.component';
import { EditMainTagComponent } from 'src/app/components/modals/edit-main-tag/edit-main-tag.component';
import { ColorElementReq } from 'src/app/models/sockets/element-sock.model';

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
  ) { }

  public onRename(title: string) {
    this.blueprint.title = title.length > 0 ? title : "Nouveau Blueprint";
    this.project.renameBlueprint(this.tabId, this.blueprint.title);
    this.socket.socket.emit(Flags.RENAME_BLUEPRINT, new RenameBlueprintOut(this.blueprintId, this.blueprint.title));
  }

  public onColorChange(color: string) {
    this.blueprint.color = color;
    this.project.colorBlueprint(this.tabId, this.blueprint.color);
    this.socket.socket.emit(Flags.COLOR_BLUEPRINT, new ColorElementReq(this.blueprintId, color));
  }


  onZoom(e: KeyboardEvent, val: string) {
    let ratio: number;
    e.preventDefault();
    if (e.keyCode == DOWN_ARROW) {
      ratio = parseFloat(val) - 1;
    } else if (e.keyCode == UP_ARROW) {
      ratio = parseFloat(val) + 1;
    } else return;
    this.component.onWheel(ratio / 100);
  }

  openTagEdit() {
    this.dialog.open(EditTagsComponent, {
      data: [this.tabId, TabTypes.BLUEPRINT],
      width: "600px",
      maxWidth: "90%",
      maxHeight: "90%"
    });
  }

  autoPosBlueprint() {
    this.component.autoPos();
  }

  toggleAutoMode() {
    this.component.autoMode = !this.component.autoMode;
  }
  toggleGrid() {
    this.component.gridMode = !this.component.gridMode;
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
    console.log(this.project.openBlueprints[this.tabId]);
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
  get component(): BlueprintComponent {
    return this.tabs.displayedTab[1] as BlueprintComponent;
  }
}
