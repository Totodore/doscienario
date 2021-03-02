import { DocumentModel, DocumentRes, Change, WriteDocumentRes } from './../models/sockets/document-sock.model';
import { GetProjectRes, ProjectUserRes, GetProjectDocumentRes } from './../models/api/project.model';
import { Injectable } from '@angular/core';
import { Tag } from '../models/sockets/tag-sock.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public openDocs: { [k: string]: DocumentModel } = {};
  public requestingId: number;

  private data: GetProjectRes = JSON.parse(localStorage.getItem("project-data"));
  public async loadData(data: GetProjectRes) {
    this.data = data;
    localStorage.setItem("project-data", JSON.stringify(data));
  }

  public get name(): string {
    return this.data.name;
  }
  public set name(name: string) {
    this.data.name = name;
  }

  public get projectUsers(): ProjectUserRes[] {
    return this.data.users;
  }
  public addProjectUser(user: ProjectUserRes) {
    this.data.users.push(user);
    this.saveData();
  }
  public removeProjectUser(user: ProjectUserRes) {
    const index = this.data.users.findIndex(el => el.id == user.id);
    this.data.users.splice(index, 1);
    this.saveData();
  }
  public addOpenDoc(packet: DocumentRes) {
    const id = packet.lastUpdate;
    packet.doc.lastChangeId = id;
    packet.doc.changes = new Map<number, Change[]>();
    packet.doc.clientUpdateId = 0;
    this.requestingId = packet.doc.id;
    this.openDocs[packet.reqId] = packet.doc;
  }
  public updateDoc(incomingDoc: WriteDocumentRes) {
    const doc = this.openDocs[incomingDoc.reqId];
    let content: string = "";
    //On part du dernier ID du packet recu jusqu'au dernière id du document,
    for (let updateIndex = incomingDoc.lastClientUpdateId + 1; updateIndex <= doc.clientUpdateId; updateIndex++) {
      //On récupère chaque update depuis le dernière id du packet jusqu'au dernier id actuel
      const update = doc.changes.get(updateIndex);
      let indexDiff = 0;
      //Pour chaque changement dans l'update
      for (const change of update) {
        switch (change[0]) {
          case 1://Si c'est un ajout :
            for (let newChange of incomingDoc.changes) { //Pour chaque nouveau changement
              let newChangeIndex = newChange[1]; //on récupère l'index de l'ajout
              if (newChangeIndex >= change[1] - indexDiff) // Si l'index de l'ajout est supérieur à l'index actuel
                newChange[1] += change[2].length;
              //On ajoute la taille de l'ancien ajout au nouvel index
            }
            indexDiff += change[2].length;  //On ajoute à l'index la taille du changement
            break;
          case -1://Si c'est une suppression
            for (let newChange of incomingDoc.changes) { //Pour chaque changement
              let newChangeIndex = newChange[1]; //On récupère l'index du nouvel l'ajout
              if (newChangeIndex >= change[1] - indexDiff) //Si on est apprès dans le texte
                newChange[1] -= change[2].length;
              //On enlève la taille de la suppression
            }
            indexDiff -= change[2].length;  //On enlève à l'index à la taille du changement
          default:
            break;
        }
      }
    }
    content = doc.content;
    let stepIndex: number = 0;
    //Pour chaque nouveau changement on fait la mise à jour à partir du packet modifié par l'agorithme ci-dessus
    for (const change of incomingDoc.changes) {
      switch (change[0]) {
        case 1:
          content = content.insert(change[1] + stepIndex, change[2]);
          break;
        case -1:
          content = content.delete(change[1] + stepIndex, change[2].length);
          stepIndex -= change[2].length;
          break;
        default: break;
      }
    }
    doc.content = content;
  }
  public setDocIndex(index: number, id: number) {
    const indexEl = Object.values(this.openDocs).findIndex(el => el.id == id);
    this.openDocs[indexEl].elIndex = index;
  }
  public removeOpenDoc(docId: number) {
    const index = Object.values(this.openDocs).findIndex(el => el.id == docId);
    delete this.openDocs[index];
  }
  public renameDoc(tabId: string, title: string) {
    this.openDocs[tabId].title = title;
  }
  public updateDocTags(tabId: string, tags: Tag[]) {
    this.openDocs[tabId].tags = tags;
  }
  public addProjectTag(tag: Tag) {
    this.data.tags.push(tag);
    this.saveData();
  }
  public removeProjectTag(name: string) {
    this.data.tags.splice(this.tags.findIndex(el => el.name === name), 1);
    this.saveData();
  }
  public updateProjectTag(tag: Tag, newTag?: Tag) {
    const index = this.tags.findIndex(el => el.name === tag.name);
    this.data.tags[index] = newTag ?? tag;
    this.saveData();
  }

  public saveData() {
    setTimeout(() => localStorage.setItem("project-data", JSON.stringify(this.data)), 0);
  }

  public set projectUsers(users: ProjectUserRes[]) {
    this.data.users = users;
    this.saveData();
  }

  public get tags(): Tag[] {
    return this.data.tags;
  }
  public set tags(tags: Tag[]) {
    this.data.tags = tags;
    this.saveData();
  }
  public get owner(): ProjectUserRes {
    return this.data.createdBy;
  }
  public get id(): number {
    return this.data.id;
  }
  public get docs(): GetProjectDocumentRes[] {
    return this.data.documents;
  }

  public getDoc(docId: number) {
    return Object.values(this.openDocs).find(el => el.id == docId);
  }
}
