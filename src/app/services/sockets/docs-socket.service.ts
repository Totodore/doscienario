import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { AddTagDocumentRes, Change, DocumentRes, EditTagDocumentReq, OpenDocumentRes, RenameDocumentRes, WriteDocumentReq, WriteDocumentRes } from 'src/app/models/sockets/document-sock.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { TabService } from '../tab.service';

@Injectable({
  providedIn: 'root'
})
export class DocsSocketService {

  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
    private readonly tabs: TabService
  ) { }


  @EventHandler(Flags.OPEN_DOC)
  onOpenDocument(packet: OpenDocumentRes) {
    this.project.addOpenDoc(packet);
  }

  @EventHandler(Flags.SEND_DOC)
  onSendDocument(packet: DocumentRes) {
    this.project.addSendDoc(packet);
    this.tabs.updateDocTab(packet.reqId, packet.doc.id);
  }

  @EventHandler(Flags.CLOSE_DOC)
  onCloseDocument(docId: number) {
    this.project.removeOpenDoc(docId);
  }

  updateDocument(docId: number, tabId: string, changes: Change[], lastChangeId: number, clientUpdateId: number) {
    const doc = this.project.openDocs[tabId];
    console.log("Updating doc", docId, "tab", tabId);
    doc.changes.set(clientUpdateId, changes);
    this.socket.emit(Flags.WRITE_DOC, new WriteDocumentReq(changes, docId, lastChangeId, clientUpdateId, this.api.user.id));
  }

  @EventHandler(Flags.WRITE_DOC)
  onUpdateDocument(doc: WriteDocumentRes) {
    this.project.getDoc(doc.docId).lastChangeId = doc.updateId;
    if (doc.userId != this.api.user.id)
      this.project.updateDoc(doc);
  }

  @EventHandler(Flags.RENAME_DOC)
  titleDocument(doc: RenameDocumentRes) {
    this.project.renameDocFromSocket(doc.title, doc.docId);
  }

  @EventHandler(Flags.REMOVE_DOC)
  onRemoveDoc(docId: number) {
    this.tabs.removeDocTab(docId);
    this.project.removeDoc(docId);
  }

  @EventHandler(Flags.CREATE_TAG)
  onCreateTag(tag: Tag) {
    const projectTag = this.project.tags.find(el => el.title == tag.title);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(tag);
    else this.project.addProjectTag(tag);
  }

  @EventHandler(Flags.TAG_ADD_DOC)
  onAddTagDoc(packet: AddTagDocumentRes) {
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
  onRemoveTagDoc(packet: EditTagDocumentReq) {
    const tags = this.project.getDoc(packet.docId).tags;
    tags.splice(tags.findIndex(el => el.title == packet.title.toLowerCase()), 1);
  }

  public get socket() { return this.api.socket; }
}
