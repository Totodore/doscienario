import { AbstractIoHandler } from './abstract-handler.service';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { DocumentComponent } from 'src/app/components/tabs/document/document.component';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Sheet } from 'src/app/models/api/sheet.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Change, OpenElementIn, SendElementIn } from 'src/app/models/sockets/in/element.in';
import { TabTypes } from 'src/app/models/sys/tab.model';
import { WriteElementIn } from '../../models/sockets/in/element.in';
import { WriteElementOut } from '../../models/sockets/out/element.out';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { TabService } from '../tab.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class SheetIoHandler extends AbstractIoHandler {

  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    logger: NGXLogger,
    socket: SocketService,
  ) { super(socket, logger) }


  @EventHandler(Flags.OPEN_SHEET)
  onOpenSheet(packet: OpenElementIn) {
    this.project.addOpenSheet(new Sheet(packet.element));
  }

  @EventHandler(Flags.SEND_SHEET)
  onSendSheet(packet: SendElementIn) {
    this.project.addSendSheet(packet);
    const tab = this.getDocumentComponent(packet.element as Sheet);
    tab.openedSheet?.loadedSheet();
  }

  public updateSheet(elementId: number, tabId: string, changes: Change[], lastChangeId: number, clientUpdateId: number) {
    const sheet = this.project.openSheets[tabId];
    this.logger.log("Updating sheet", elementId, "tab", tabId);
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
  onRemoveElement([elementId, documentId]: [number, number]) {
    const tab = this.getDocumentComponent(documentId);
    tab.openedSheet?.onSheetClose();
    this.project.removeSheet(elementId, documentId);
  }

  private getDocumentComponent(sheet: Sheet | number) {
    return this.tabs.getTab<DocumentComponent>(TabTypes.DOCUMENT, typeof sheet === 'number' ? sheet : sheet.documentId);
  }

}
