import { RenameElementIn, WriteElementIn } from './../../models/sockets/in/element.in';
import { WriteElementOut } from './../../models/sockets/out/element.out';
import { Injectable } from '@angular/core';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Sheet } from 'src/app/models/api/sheet.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Change, OpenElementIn, SendElementIn } from 'src/app/models/sockets/in/element.in';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { TabService } from '../tab.service';

@Injectable({
  providedIn: 'root'
})
export class SheetSocketService {

  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
    private readonly tabs: TabService
  ) { }


  @EventHandler(Flags.OPEN_SHEET)
  onOpenSheet(packet: OpenElementIn) {
    this.project.addOpenSheet(new Sheet(packet.element));
  }

  @EventHandler(Flags.SEND_SHEET)
  onSendSheet(packet: SendElementIn) {
    this.project.addSendSheet(packet);
    // this.tabs.update(packet.reqId, packet.element.id);
  }

  @EventHandler(Flags.CLOSE_SHEET)
  onCloseSheet(elementId: number) {
    this.project.removeOpenSheet(elementId);
  }

  public updateSheet(elementId: number, tabId: string, changes: Change[], lastChangeId: number, clientUpdateId: number) {
    const sheet = this.project.openSheets[tabId];
    console.log("Updating sheet", elementId, "tab", tabId);
    sheet.changes.set(clientUpdateId, changes);
    this.socket.emit(Flags.WRITE_SHEET, new WriteElementOut(elementId, lastChangeId, changes, this.api.user.id, clientUpdateId));
  }

  @EventHandler(Flags.WRITE_SHEET)
  onUpdateSheet(sheet: WriteElementIn) {
    this.project.getSheet(sheet.elementId).lastChangeId = sheet.updateId;
    if (sheet.userId != this.api.user.id)
      this.project.updateSheet(sheet);
  }

  // @EventHandler(Flags.RENAME_SHEET)
  // titleSheet(sheet: RenameElementIn) {
  //   this.project.renameSheetFromSocket(sheet.title, sheet.elementId);
  // }

  @EventHandler(Flags.REMOVE_SHEET)
  onRemoveElement(elementId: number) {
    // this.tabs.removeElementTab(elementId);
    this.project.removeSheet(elementId);
  }

  public get socket() { return this.api.socket; }
}
