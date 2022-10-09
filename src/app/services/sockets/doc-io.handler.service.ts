import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { AddTagElementIn, RemoveTagElementIn } from 'src/app/models/sockets/in/tag.in';
import { WriteElementOut } from 'src/app/models/sockets/out/element.out';
import { Change, ColorElementIn, OpenElementIn, RenameElementIn, SendElementIn, WriteElementIn } from '../../models/sockets/in/element.in';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { TabService } from '../tab.service';
import { AbstractIoHandler } from './abstract-handler.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class DocIoHandler extends AbstractIoHandler {

  
  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
    private readonly tabs: TabService,
    logger: NGXLogger,
    socket: SocketService
  ) { super(socket, logger) }


  @EventHandler(Flags.OPEN_DOC)
  onOpenDocument(packet: OpenElementIn) {
    this.project.addOpenDoc(packet);
  }

  @EventHandler(Flags.SEND_DOC)
  onSendDocument(packet: SendElementIn) {
    this.project.addSendDoc(packet);
    this.tabs.updateDocTab(packet.reqId, packet.element.id);
  }

  @EventHandler(Flags.CLOSE_DOC)
  onCloseDocument(docId: number) {
    this.project.removeOpenDoc(docId);
  }

  updateDocument(docId: number, tabId: string, changes: Change[], lastChangeId: number, clientUpdateId: number) {
    const doc = this.project.openDocs[tabId];
    this.logger.log("Updating doc", docId, "tab", tabId);
    doc.changes.set(clientUpdateId, changes);
    this.socket.emit(Flags.WRITE_DOC, new WriteElementOut(docId, lastChangeId, changes, this.api.user.id, clientUpdateId));
  }

  @EventHandler(Flags.WRITE_DOC)
  onUpdateDocument(doc: WriteElementIn) {
    this.project.getDoc(doc.elementId).lastChangeId = doc.updateId;
    if (doc.userId != this.api.user.id)
      this.project.updateDoc(doc);
  }

  @EventHandler(Flags.RENAME_DOC)
  titleDocument(doc: RenameElementIn) {
    this.project.renameDocFromSocket(doc.title, doc.elementId);
  }

  @EventHandler(Flags.COLOR_DOC)
  onColorDoc(packet: ColorElementIn) {
    this.project.docs.find(el => el.id === packet.elementId).color = packet.color;
  }

  @EventHandler(Flags.REMOVE_DOC)
  onRemoveDoc(docId: number) {
    this.tabs.removeDocTab(docId);
    this.project.removeDoc(docId);
  }

  @EventHandler(Flags.TAG_ADD_DOC)
  onAddTagDoc(packet: AddTagElementIn) {
    const projectTag = this.project.tags.find(el => el.title == packet.tag.title);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(packet.tag);
    else if (!projectTag)
      this.project.addProjectTag(packet.tag);
    const doc = this.project.getDoc(packet.docId);
    const tag = doc.tags.find(el => el.title == packet.tag.title);
    if (tag)
      doc.tags[doc.tags.indexOf(tag)] = packet.tag;
    else
      doc.tags.push(packet.tag);
  }

  @EventHandler(Flags.TAG_REMOVE_DOC)
  onRemoveTagDoc(packet: RemoveTagElementIn) {
    const tags = this.project.getDoc(packet.elementId).tags;
    tags.splice(tags.findIndex(el => el.title == packet.title.toLowerCase()), 1);
  }


}
