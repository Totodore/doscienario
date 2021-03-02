import { Tag, UpdateTagColorReq, UpdateTagNameReq } from './../models/sockets/tag-sock.model';
import { TabService } from './tab.service';
import { WriteDocumentReq, Change, DocumentModel, DocumentRes, WriteDocumentRes, RenameDocumentRes, EditTagDocumentReq, AddTagDocumentRes } from './../models/sockets/document-sock.model';
import { ProjectService } from 'src/app/services/project.service';
import { Flags } from './../models/sockets/flags.enum';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Socket, connect } from 'socket.io-client';
import { EventHandler, registerHandler } from '../decorators/subscribe-event.decorator';
import { Injectable } from '@angular/core';
import { UserDetailsRes } from '../models/api/user.model';
import { ProjectUserRes } from '../models/api/project.model';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: typeof Socket;
  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
  ) {}

  connect() {
    this.socket = connect(`ws://${environment.apiUrl}`, {
      path: "/dash",
      query: {
        "project": localStorage.getItem("project"),
        "authorization": this.api.jwt
      }
    });
    this.api.socket = this.socket;
    registerHandler(this, this.socket);
  }

  @EventHandler("connect")
  onConnect() {
    console.info("Socket successfully connected");
  }

  @EventHandler(Flags.RENAME_PROJECT)
  onUpdateProject(name: string) {
    this.project.name = name;
  }

  updateProject(name: string) {
    this.socket.emit(Flags.RENAME_PROJECT, name);
  }

  updateUserProject(users: ProjectUserRes[]) {
    const addedUser = users.filter(el => !this.project.projectUsers.find(value => el.id === value.id))?.[0];
    const removedUser = this.project.projectUsers.filter(el => !users.find(value => el.id === value.id))?.[0];
    if (addedUser)
      this.socket.emit(Flags.ADD_USER_PROJECT, addedUser);
    else if (removedUser)
      this.socket.emit(Flags.REMOVE_USER_PROJECT, removedUser);
  }

  @EventHandler(Flags.ADD_USER_PROJECT)
  onAddUserProject(user: UserDetailsRes) {
    this.project.addProjectUser(user);
  }

  @EventHandler(Flags.REMOVE_USER_PROJECT)
  onRemoveUserProject(user: UserDetailsRes) {
    this.project.removeProjectUser(user);
  }

  /**
   * Open a document or create one
   */
  openDocument(tabId: string, docId?: number) {
    this.socket.emit(Flags.OPEN_DOC, [tabId, docId]);
  }

  @EventHandler(Flags.SEND_DOC)
  onOpenDocument(packet: DocumentRes) {
    this.project.addOpenDoc(packet);
  }

  closeDocument(docId: number) {
    this.socket.emit(Flags.CLOSE_DOC, docId);
  }

  @EventHandler(Flags.CLOSE_DOC)
  onCloseDocument(docId: number) {
    this.project.removeOpenDoc(docId);
  }

  updateDocument(docId: number, tabId: string, changes: Change[], lastChangeId: number, clientUpdateId: number) {
    const doc = this.project.openDocs[tabId];
    doc.changes.set(clientUpdateId, changes);
    setTimeout(() => this.socket.emit(Flags.WRITE_DOC, new WriteDocumentReq(changes, docId, lastChangeId, clientUpdateId, this.api.user.id)), 3000);
  }

  @EventHandler(Flags.WRITE_DOC)
  onUpdateDocument(doc: WriteDocumentRes) {
    this.project.getDoc(doc.docId).lastChangeId = doc.updateId;
    if (doc.userId != this.api.user.id)
      this.project.updateDoc(doc);
  }

  @EventHandler(Flags.RENAME_DOC)
  onRenameDocument(doc: RenameDocumentRes) {
    this.project.getDoc(doc.docId).title = doc.title;
  }

  @EventHandler(Flags.CREATE_TAG)
  onCreateTag(tag: Tag) {
    const projectTag = this.project.tags.find(el => el.name == tag.name);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(tag);
    else this.project.addProjectTag(tag);
  }

  @EventHandler(Flags.TAG_ADD_DOC)
  onAddTagDoc(packet: AddTagDocumentRes) {
    const projectTag = this.project.tags.find(el => el.name == packet.tag.name);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(packet.tag);
    else if (!projectTag)
      this.project.addProjectTag(packet.tag);
    const doc = this.project.getDoc(packet.docId);
    const tag = doc.tags.find(el => el.name == packet.tag.name);
    if (tag)
      doc.tags[doc.tags.indexOf(tag)] = packet.tag;
    else
      doc.tags.push(packet.tag);
  }

  @EventHandler(Flags.TAG_REMOVE_DOC)
  onRemoveTagDoc(packet: EditTagDocumentReq) {
    const tags = this.project.getDoc(packet.docId).tags;
    tags.splice(tags.findIndex(el => el.name == packet.name.toLowerCase()), 1);
  }

  @EventHandler(Flags.COLOR_TAG)
  onColorTag(packet: UpdateTagColorReq) {
    this.project.tags.find(el => el.name === packet.name).color = packet.color;
    this.project.saveData();
  }

  @EventHandler(Flags.RENAME_TAG)
  onRenameTag(packet: UpdateTagNameReq) {
    this.project.tags.find(el => el.name === packet.oldName).name = packet.name;
    this.project.saveData();
  }

  @EventHandler(Flags.REMOVE_TAG)
  onRemoveTag(tagName: string) {
    this.project.removeProjectTag(tagName);
  }
}
