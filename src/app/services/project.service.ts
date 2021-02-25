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
    doc.doc.changes = new Map<number, Change[]>();
    doc.doc.clientUpdateId = 0;
    this.openDocs.push(doc.doc);
  }
  public updateDoc(incomingDoc: WriteDocumentRes) {
    const doc = this.openDocs.find(el => el.id == incomingDoc.docId);
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
    console.log(content);
    doc.content = content;
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
