import { TabService } from './tab.service';
import { WriteDocumentReq, Change, DocumentModel, DocumentRes, WriteDocumentRes } from './../models/sockets/document-sock.model';
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
  openDocument(docId?: number) {
    this.socket.emit(Flags.OPEN_DOC, docId);
  }

  @EventHandler(Flags.SEND_DOC)
  onOpenDocument(doc: DocumentRes) {
    this.project.addOpenDoc(doc);
  }

  closeDocument(docId: number) {
    this.socket.emit(Flags.CLOSE_DOC, docId);
  }

  @EventHandler(Flags.CLOSE_DOC)
  onCloseDocument(docId: number) {
    this.project.removeOpenDoc(docId);
  }

  updateDocument(docId: number, changes: Change[], lastChangeId: number) {
    this.socket.emit(Flags.WRITE_DOC, new WriteDocumentReq(changes, docId, lastChangeId));
  }

  @EventHandler(Flags.WRITE_DOC)
  onUpdateDocument(doc: WriteDocumentRes) {
    this.project.openDocs.find(el => el.id == doc.docId).lastChangeId = doc.updateId;
  }
}
