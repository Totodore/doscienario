import { ProjectService } from 'src/app/services/project.service';
import { Flags } from './../models/sockets/flags.enum';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Socket, connect } from 'socket.io-client';
import { EventHandler, registerHandler } from '../decorators/subscribe-event.decorator';
import { Injectable } from '@angular/core';
import { UserDetailsRes } from '../models/api/user.model';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: typeof Socket;
  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService
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

  @EventHandler(Flags.ADD_USER_PROJECT)
  onAddUserProject(user: UserDetailsRes) {
    this.project.addProjectUser(user);
  }

  addUserProject(user: UserDetailsRes) {
    this.socket.emit(Flags.ADD_USER_PROJECT, user);
  }

  @EventHandler(Flags.REMOVE_USER_PROJECT)
  onRemoveUserProject(user: UserDetailsRes) {
    this.project.removeProjectUser(user);
  }

  removeUserProject(user: UserDetailsRes) {
    this.socket.emit(Flags.REMOVE_USER_PROJECT, user);
  }
}
