import { DocumentModel, DocumentRes, Change, WriteDocumentRes } from './../models/sockets/document-sock.model';
import { GetProjectRes, ProjectUserRes } from './../models/api/project.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public openDocs: DocumentModel[] = [];

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
    const data = this.data;
    data.users.push(user);
    this.data = data;
    console.log(this.data.users);
  }
  public removeProjectUser(user: ProjectUserRes) {
    const data = this.data;
    const index = data.users.findIndex(el => el.id == user.id);
    data.users.splice(index, 1);
    this.data = data;
  }
  public addOpenDoc(doc: DocumentRes) {
    const id = doc.lastUpdate;
    doc.doc.lastChangeId = id;
    this.openDocs.push(doc.doc);
  }
  public updateDoc(incomingDoc: WriteDocumentRes) {
    const doc = this.openDocs.find(el => el.id == incomingDoc.docId);
    for (const change of incomingDoc.change) {

    }
  }
  public setDocIndex(index: number, id: number) {
    const indexEl = this.openDocs.findIndex(el => el.id == id);
    this.openDocs[indexEl].elIndex = index;
  }
  public removeOpenDoc(docId: number) {
    const index = this.openDocs.findIndex(el => el.id == docId);
    this.openDocs.splice(index, 1);
  }

  public set projectUsers(users: ProjectUserRes[]) {
    const data = this.data;
    data.users = users;
    this.data = data;
  }

  public get owner(): ProjectUserRes {
    return this.data.createdBy;
  }

  private get data(): GetProjectRes {
    return JSON.parse(localStorage.getItem("project-data"));
  }
  private set data(data: GetProjectRes) {
    localStorage.setItem("project-data", JSON.stringify(data));
  }
}
