import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { DocumentModel, DocumentRes, Change, WriteDocumentRes, OpenDocumentRes } from './../models/sockets/document-sock.model';
import { GetProjectRes, ProjectUserRes, GetProjectDocumentRes, SearchQueryRes } from './../models/api/project.model';
import { Injectable, OnInit } from '@angular/core';
import { Tag } from '../models/sockets/tag-sock.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements OnInit {

  public openDocs: { [k: string]: DocumentModel } = {};
  public requestingId: number;

  constructor(
    private readonly router: Router
  ) {}
  ngOnInit(): void {
    console.log("test");
  }

  private data: GetProjectRes = JSON.parse(localStorage.getItem("project-data"));
  public async loadData(data: GetProjectRes) {
    this.data = data;
    localStorage.setItem("project-data", JSON.stringify(data));
    this.openDocs = {};
    this.requestingId = null;
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
  public addSendDoc(packet: DocumentRes) {
    const id = packet.lastUpdate;
    packet.doc.lastChangeId = id;
    packet.doc.changes = new Map<number, Change[]>();
    packet.doc.clientUpdateId = 0;
    console.log("Add Send doc");
    this.requestingId = packet.doc.id;
    this.openDocs[packet.reqId] = packet.doc;
    if (!this.data.documents.find(el => el.id == packet.doc.id)) {
      this.data.documents.push(packet.doc);
      this.saveData();
    }
  }
  /**
   * Add a doc to the local data if the doc has been created
   */
  public addOpenDoc(packet: OpenDocumentRes) {
    if (!this.data.documents.find(el => el.id == packet.doc.id)) {
      this.data.documents.push(packet.doc);
      this.saveData();
    }
  }

  public updateDoc(incomingDoc: WriteDocumentRes) {
    const doc = this.getDoc(incomingDoc.docId);
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
  public renameDocFromSocket(title: string, docId: number) {
    this.data.documents.find(el => el.id == docId).title = title;
    const doc = Object.values(this.openDocs).find(el => el.id == docId);
    if (doc)
      doc.title = title;
    this.saveData();
  }
  public renameDoc(tabId: string, title: string) {
    this.openDocs[tabId].title = title;
    const docId = this.openDocs[tabId].id;
    this.data.documents.find(el => el.id == docId).title = title;
    this.saveData();
  }
  /**
   * Remove a doc from its tab id or docId
   * If it is tab id it means that the doc should be opened
   */
  public removeDoc(id: string | number) {
    if (typeof id === 'string') {
      const docId = this.openDocs[id].id;
      delete this.openDocs[id];
      this.data.documents.splice(this.docs.findIndex(el => el.id == docId), 1);
    } else if (typeof id === 'number') {
      for (const tabId in this.openDocs) {
        if (this.openDocs[tabId].id === id) {
          delete this.openDocs[tabId];
          break;
        }
      }
      this.data.documents.splice(this.docs.findIndex(el => el.id == id), 1);
    }
    this.saveData();
  }
  public updateDocTags(tabId: string, tags: Tag[]) {
    this.openDocs[tabId].tags = tags;
    const docId = this.openDocs[tabId].id;
    this.data.documents.find(el => el.id == docId).tags = tags;
    this.saveData();
  }
  public addProjectTag(tag: Tag) {
    this.data.tags.push(tag);
    this.saveData();
  }
  public removeProjectTag(name: string) {
    this.data.tags.splice(this.tags.findIndex(el => el.name === name), 1);
    for (const doc of this.data.documents)
      doc.tags.splice(doc.tags.findIndex(el => el.name === name), 1);
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
  public exit() {
    localStorage.removeItem("project-data");
    localStorage.removeItem("project");
    localStorage.removeItem("tabs");
    this.router.navigateByUrl("/menu");
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
