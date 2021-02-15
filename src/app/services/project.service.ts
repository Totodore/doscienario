import { ApiService } from 'src/app/services/api.service';
import { Socket } from 'socket.io-client';
import { SocketService } from './socket.service';
import { Flags } from './../models/sockets/flags.enum';
import { GetProjectRes, ProjectUserRes } from './../models/api/project.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
  ) { }

  public get name(): string {
    return this.data.name;
  }
  public set name(name: string) {
    const data = this.data;
    data.name = name;
    this.data = data;
  }

  public get projectUsers(): ProjectUserRes[] {
    return this.data.users;
  }
  public addProjectUser(user: ProjectUserRes) {
    const users = this.data.users;
    users.push(user);
    this.data.users = users;
  }
  public removeProjectUser(user: ProjectUserRes) {
    const users = this.data.users;
    const index = users.findIndex(el => el.id == user.id);
    users.splice(index, 1);
    this.data.users = users;
  }
  public set projectUsers(users: ProjectUserRes[]) {
    const data = this.data;
    data.users = users;
    this.data = data;
  }

  private get data(): GetProjectRes {
    return JSON.parse(localStorage.getItem("project-data"));
  }
  private set data(data: GetProjectRes) {
    localStorage.setItem("project-data", JSON.stringify(data));
  }
}
