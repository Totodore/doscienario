import { OpenSheetRes } from './../../models/sockets/sheet-socket.model';
import { WriteElementReq, WriteElementRes } from './../../models/sockets/element-sock.model';
import { Injectable } from '@angular/core';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Flags } from 'src/app/models/sockets/flags.enum';
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
  onOpenElementument(packet: OpenSheetRes) {
    this.project.addOpenElement(packet);
  }

  @EventHandler(Flags.SEND_SHEET)
  onSendElementument(packet: ElementumentRes) {
    this.project.addSendElement(packet);
    this.tabs.updateElementTab(packet.reqId, packet.element.id);
  }

  @EventHandler(Flags.CLOSE_SHEET)
  onCloseElementument(elementId: number) {
    this.project.removeOpenElement(elementId);
  }

  updateSheet(elementId: number, tabId: string, changes: Change[], lastChangeId: number, clientUpdateId: number) {
    const Element = this.project.openElements[tabId];
    console.log("Updating sheet", elementId, "tab", tabId);
    Element.changes.set(clientUpdateId, changes);
    this.socket.emit(Flags.WRITE_SHEET, new WriteElementReq(changes, elementId, lastChangeId, clientUpdateId, this.api.user.id));
  }

  @EventHandler(Flags.WRITE_SHEET)
  onUpdateElementument(Element: WriteElementRes) {
    this.project.getElement(Element.elementId).lastChangeId = Element.updateId;
    if (Element.userId != this.api.user.id)
      this.project.updateElement(Element);
  }

  @EventHandler(Flags.RENAME_SHEET)
  titleElementument(Element: RenameElementumentRes) {
    this.project.renameElementFromSocket(Element.title, Element.elementId);
  }

  @EventHandler(Flags.REMOVE_SHEET)
  onRemoveElement(elementId: number) {
    this.tabs.removeElementTab(elementId);
    this.project.removeElement(elementId);
  }

  public get socket() { return this.api.socket; }
}
