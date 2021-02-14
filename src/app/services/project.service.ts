import { GetProjectRes } from './../models/api/project.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }

  public get name(): string {
    return this.data.name;
  }

  private get data(): GetProjectRes {
    return JSON.parse(localStorage.getItem("project-data"));
  }
}
