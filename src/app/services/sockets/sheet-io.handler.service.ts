import { AbstractIoHandler } from './abstract-handler.service';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { DocumentComponent } from 'src/app/components/tabs/document/document.component';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Sheet, SheetSock } from 'src/app/models/api/sheet.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Change, OpenElementIn, SendElementIn } from 'src/app/models/sockets/in/element.in';
import { TabTypes } from 'src/app/models/sys/tab.model';
import { WriteElementIn } from '../../models/sockets/in/element.in';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { TabService } from '../tab.service';
import { SocketService } from './socket.service';
import { applyTextChanges } from 'src/app/utils/element.utils';
import { SheetEditorComponent } from 'src/app/components/tabs/document/sheet-editor/sheet-editor.component';

@Injectable({
  providedIn: 'root'
})
export class SheetIoHandler extends AbstractIoHandler {

  private openedSheetDocId?: string;

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
    const id = packet.lastUpdate;
    const sheet = new SheetSock(packet.element);
    sheet.lastChangeId = id;
    sheet.changes = new Map<number, Change[]>();
    sheet.clientUpdateId = 0;
    const sheetEditor = this.getCurrentSheetComponent(packet.element.id);
    this.logger.log("Adding sheet content to opened sheet", sheet.id, sheetEditor?.tabId, sheetEditor?.docId);
    sheetEditor.sheet = sheet;
    this.project.addSendSheet(sheet, sheetEditor.tabId);
    sheetEditor.loadedSheet();
  }


  @EventHandler(Flags.WRITE_SHEET)
  onUpdateSheet(packet: WriteElementIn) {
    const sheet = this.getCurrentSheetComponent(packet.elementId).sheet;
    sheet.lastChangeId = packet.updateId;
    if (packet.userId != this.api.user.id) {
        sheet.content = applyTextChanges(sheet, packet);
    }
  }


  @EventHandler(Flags.REMOVE_SHEET)
  onRemoveElement([elementId, documentId]: [number, number]) {
    const sheetEditor = this.getCurrentSheetComponent(elementId);
    if (sheetEditor?.sheet?.id == elementId)
      sheetEditor.onSheetClose();
    this.project.removeSheet(elementId, documentId);
  }

  /**
   * Find the current sheet component and put the doc tab id in cache
   */
  private getCurrentSheetComponent(id: number) {
    const doc = this.tabs.getTabFromId<DocumentComponent>(this.openedSheetDocId);
    if (doc && doc.sheetEditor?.id == id) {
      return doc.sheetEditor;
    }
    else {
      const doc = this.tabs.tabs.find(tab => tab.type == TabTypes.DOCUMENT && (tab as DocumentComponent).sheetEditor?.id == id) as DocumentComponent;
      this.openedSheetDocId = doc?.tabId;
      return doc?.sheetEditor;
    }
  }

}
