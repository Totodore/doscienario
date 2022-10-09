import { AbstractIoHandler } from './abstract-handler.service';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ProjectService } from 'src/app/services/project.service';
import { EventHandler } from '../../decorators/subscribe-event.decorator';
import { User } from '../../models/api/project.model';
import { Flags } from '../../models/sockets/flags.enum';
import { SnackbarService } from '../ui/snackbar.service';
import { SocketService } from './socket.service';


@Injectable({
  providedIn: 'root'
})
export class IoHandler extends AbstractIoHandler {

  constructor(
    private readonly snackbar: SnackbarService,
    private readonly project: ProjectService,
    logger: NGXLogger,
    socket: SocketService,
  ) { super(socket, logger) }

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