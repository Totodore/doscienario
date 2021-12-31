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
import { SnackbarService } from '../ui/snackbar.service';
import { SheetSocketService } from './sheet-socket.service';
import { NGXLogger } from 'ngx-logger';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: typeof Socket;
  constructor(
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService,
    private readonly project: ProjectService,
    private readonly docsSocket: DocsSocketService,
    private readonly treeSocket: TreeSocketService,
    private readonly sheetSocket: SheetSocketService,
    private readonly logger: NGXLogger,
  ) {}

  connect() {
    this.socket = connect(`${environment.secured ? "wss" : "ws"}://${environment.apiUrl}`, {
      path: "/dash",
      query: {
        "project": localStorage.getItem("project"),
        "authorization": this.api.jwt
      }
    });
    registerHandlers([this, this.docsSocket, this.treeSocket, this.sheetSocket], this.socket);
    this.api.socket = this.socket;
  }

  @EventHandler("connect")
  onConnect() {
    this.logger.info("Socket successfully connected");
  }

  @EventHandler("exception")
  onException(error: WsException) {
    this.logger.error('Ws Exception:', error);
    this.snackbar.snack("Erreur avec le serveur!", 1000);
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

type WsException = { status: string, message: string };