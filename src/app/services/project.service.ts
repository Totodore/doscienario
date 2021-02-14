import { GetProjectRes, ProjectUserRes } from './../models/api/project.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }

  public get name(): string {
    return this.data.name;
  }

  public get projectUsers(): ProjectUserRes[] {
    return this.data.users;
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
