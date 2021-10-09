import { OpenBlueprintReq, SendBlueprintReq, CloseBlueprintReq, CreateNodeReq, RemoveNodeIn, CreateRelationReq, RemoveRelationReq, PlaceNodeIn, Relationship, EditSumarryIn, WriteNodeContentOut, WriteNodeContentIn } from '../../models/sockets/blueprint-sock.model';
import { Tag, UpdateTagColorReq, UpdateTagNameReq } from '../../models/sockets/tag-sock.model';
import { TabService } from '../tab.service';
import { WriteDocumentReq, Change, DocumentSock, DocumentRes, WriteDocumentRes, RenameDocumentRes, EditTagDocumentReq, AddTagDocumentRes, OpenDocumentRes } from '../../models/sockets/document-sock.model';
import { ProjectService } from 'src/app/services/project.service';
import { Flags } from '../../models/sockets/flags.enum';
import { ApiService } from '../api.service';
import { environment } from '../../../environments/environment';
import { Socket, connect } from 'socket.io-client';
import { EventHandler, registerHandlers } from '../../decorators/subscribe-event.decorator';
import { Injectable } from '@angular/core';
import { User } from '../../models/api/project.model';
import { DocsSocketService } from './docs-socket.service';
import { TreeSocketService } from './tree-socket.service';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: typeof Socket;
  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
    private readonly docsSocket: DocsSocketService,
    private readonly treeSocket: TreeSocketService,
  ) {}

  connect() {
    this.socket = connect(`${environment.secured ? "wss" : "ws"}://${environment.apiUrl}`, {
      path: "/dash",
      query: {
        "project": localStorage.getItem("project"),
        "authorization": this.api.jwt
      }
    });
    registerHandlers([this, this.docsSocket, this.treeSocket], this.socket);
    this.api.socket = this.socket;
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

  updateUserProject(users: User[]) {
    const addedUser = users.filter(el => !this.project.projectUsers.find(value => el.id === value.id))?.[0];
    const removedUser = this.project.projectUsers.filter(el => !users.find(value => el.id === value.id))?.[0];
    if (addedUser)
      this.socket.emit(Flags.ADD_USER_PROJECT, addedUser);
    else if (removedUser)
      this.socket.emit(Flags.REMOVE_USER_PROJECT, removedUser);
  }

  @EventHandler(Flags.ADD_USER_PROJECT)
  onAddUserProject(user: User) {
    this.project.addProjectUser(user);
  }

  @EventHandler(Flags.REMOVE_USER_PROJECT)
  onRemoveUserProject(user: User) {
    this.project.removeProjectUser(user);
  }
}
