import { TabService } from './tab.service';
import { Router } from '@angular/router';
import { Project, User } from './../models/api/project.model';
import { Injectable } from '@angular/core';
import { removeNodeFromTree } from '../utils/tree.utils';
import { TabTypes } from '../models/tab-element.model';
import { BlueprintComponent } from '../components/tabs/blueprint/blueprint.component';
import { WorkerManager, WorkerType } from '../utils/worker-manager.utils';
import { Document, DocumentSock } from '../models/api/document.model';
import { Blueprint, Relationship } from '../models/api/blueprint.model';
import { Tag } from '../models/api/tag.model';
import { SheetSock } from '../models/api/sheet.model';
import { Change, OpenElementIn, SendElementIn, WriteElementIn } from '../models/sockets/in/element.in';
import { CreateNodeIn, CreateRelationIn, EditSummaryIn, PlaceNodeIn, RemoveNodeIn, RemoveRelationIn } from '../models/sockets/in/blueprint.in';
import { Element } from '../models/default.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public openDocs: { [k: string]: DocumentSock } = {};
  public openBlueprints: { [k: string]: Blueprint } = {};
  public openSheets: { [k: string]: SheetSock } = {};

  public updateSearch: (val?: string) => void;
  public toggleTag: (tag: Tag) => void;

  private searchWorker: WorkerManager;
  constructor(
    private readonly router: Router,
    private readonly tabs: TabService,
  ) {
    this.searchWorker = new WorkerManager(WorkerType.Search);
  }

  private data = new Project(JSON.parse(localStorage.getItem("project-data"), JSON.dateParser));
  public async loadData(data: Project) {
    this.data = data;
    localStorage.setItem("project-data", JSON.stringify(data));
    this.openDocs = {};
    this.openBlueprints = {};
  }

  public get name(): string {
    return this.data.name;
  }
  public set name(name: string) {
    this.data.name = name;
  }

  public get projectUsers(): User[] {
    return this.data.users;
  }
  public addProjectUser(user: User) {
    this.data.users.push(user);
    this.saveData();
  }
  public removeProjectUser(user: User) {
    const index = this.data.users.findIndex(el => el.id == user.id);
    this.data.users.splice(index, 1);
    this.saveData();
  }
  public addProjectTag(tag: Tag) {
    this.data.tags.push(tag);
    this.updateSearch();
    this.saveData();
  }
  public removeProjectTag(name: string) {
    this.data.tags.splice(this.tags.findIndex(el => el.title === name), 1);
    for (const doc of this.data.documents)
      doc.tags.splice(doc.tags.findIndex(el => el.title === name), 1);
    this.updateSearch();
    this.saveData();
  }
  public updateProjectTag(tag: Tag, newTag?: Tag) {
    const index = this.tags.findIndex(el => el.title === tag.title);
    this.data.tags[index] = newTag ?? tag;
    this.saveData();
    this.updateSearch();
  }

  public addSendDoc(packet: SendElementIn) {
    const id = packet.lastUpdate;
    const document = new DocumentSock(packet.element);
    document.lastChangeId = id;
    document.changes = new Map<number, Change[]>();
    document.clientUpdateId = 0;
    console.log("Add Send doc");
    this.openDocs[packet.reqId] = document;
    if (!this.data.documents.find(el => el.id == packet.element.id)) {
      this.data.documents.push(document);
      this.updateSearch();
      this.saveData();
    }
  }
  /**
   * Add a doc to the local data if the doc has been created
   */
  public addOpenDoc(packet: OpenElementIn) {
    if (!this.data.documents.find(el => el.id == packet.element.id)) {
      this.data.documents.push(new Document(packet.element));
      this.saveData();
      this.updateSearch();
    }
  }

  public updateDoc(incomingDoc: WriteElementIn) {
    const doc = this.getDoc(incomingDoc.elementId);
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
        case 2:
          content = change[2];
          stepIndex = change[2].length;
        default: break;
      }
    }
    doc.content = content;
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
    this.updateSearch();
    this.saveData();
  }
  public renameDoc(tabId: string, title: string) {
    this.openDocs[tabId].title = title;
    const docId = this.openDocs[tabId].id;
    this.data.documents.find(el => el.id == docId).title = title;
    this.updateSearch();
    this.saveData();
  }
  public colorDoc(tabId: string, color: string) {
    this.openDocs[tabId].color = color;
    const docId = this.openDocs[tabId].id;
    this.data.documents.find(el => el.id == docId).color = color;
    this.updateSearch();
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
    this.updateSearch();
    this.saveData();
  }
  public updateDocTags(tabId: string, tags: Tag[]) {
    this.openDocs[tabId].tags = tags;
    const docId = this.openDocs[tabId].id;
    this.data.documents.find(el => el.id == docId).tags = tags;
    for (const tag of tags) {
      if (!this.data.tags.find(el => el.title.toLowerCase() === tag.title.toLowerCase()))
        this.data.tags.push(tag);
    }
    this.saveData();
  }

  public addSendBlueprint(packet: SendElementIn) {
    console.log("Add Send blueprint");
    const blueprint = this.openBlueprints[packet.reqId] = new Blueprint(packet.element);
    if (!this.data.blueprints.find(el => el.id == blueprint.id)) {
      this.data.blueprints.push(blueprint);
      this.saveData();
      this.updateSearch();
    }
  }
  /**
   * Add a doc to the local data if the doc has been created
   */
  public addOpenBlueprint(packet: OpenElementIn) {
    if (!this.data.blueprints.find(el => el.id == packet.element.id)) {
      this.data.blueprints.push(new Blueprint(packet.element));
      this.saveData();
      this.updateSearch();
    }
  }

  public removeOpenBlueprint(blueprintId: number) {
    const index = Object.values(this.openBlueprints).findIndex(el => el.id == blueprintId);
    delete this.openBlueprints[index];
  }
  public renameBlueprintFromSocket(title: string, blueprintId: number) {
    this.data.blueprints.find(el => el.id == blueprintId).title = title;
    const doc = Object.values(this.openDocs).find(el => el.id == blueprintId);
    if (doc)
      doc.title = title;
    this.saveData();
    this.updateSearch();
  }
  public renameBlueprint(tabId: string, title: string) {
    this.openBlueprints[tabId].title = title;
    const docId = this.openBlueprints[tabId].id;
    this.data.blueprints.find(el => el.id == docId).title = title;
    this.saveData();
    this.updateSearch();
  }

  public colorBlueprint(tabId: string, color: string) {
    this.openBlueprints[tabId].color = color;
    const docId = this.openBlueprints[tabId].id;
    this.data.blueprints.find(el => el.id == docId).color = color;
    this.updateSearch();
    this.saveData();
  }
  /**
   * Remove a blueprint from its tab id or docId
   * If it is tab id it means that the doc should be opened
   */
  public removeBlueprint(id: string | number) {
    if (typeof id === 'string') {
      const docId = this.openBlueprints[id].id;
      delete this.openBlueprints[id];
      this.data.blueprints.splice(this.docs.findIndex(el => el.id == docId), 1);
    } else if (typeof id === 'number') {
      for (const tabId in this.openBlueprints) {
        if (this.openBlueprints[tabId].id === id) {
          delete this.openBlueprints[tabId];
          break;
        }
      }
      this.data.blueprints.splice(this.blueprints.findIndex(el => el.id == id), 1);
    }
    this.saveData();
    this.updateSearch();
  }
  public async addBlueprintNode(packet: CreateNodeIn) {
    this.getBlueprint(packet.node.blueprint.id).nodes.push(packet.node);
    if (this.tabs.displayedTab[1].type === TabTypes.BLUEPRINT && this.tabs.displayedTab[1].id === packet.node.blueprint.id && packet.user === packet.node.createdBy.id) {
      window.setTimeout(async () => {
        const component = this.tabs.displayedTab[1] as BlueprintComponent;
        if (component.autoMode)
          await component.autoPos(packet.node);
        this.saveData();
      }, 0);
    } else
      this.saveData();
  }
  public placeBlueprintNode(packet: PlaceNodeIn) {
    const node = this.getBlueprint(packet.blueprintId).nodes.find(el => el.id === packet.id);
    node.x = packet.pos[0];
    node.y = packet.pos[1];
    this.saveData();
  }
  public placeBlueprintRel(packet: Relationship) {
    const rel = this.getBlueprint(packet.blueprint.id).relationships.find(el => el.id === packet.id);
    rel.ex = packet.ex;
    rel.ey = packet.ey;
    rel.ox = packet.ox;
    rel.oy = packet.oy;
    this.saveData();
  }
  public removeBlueprintNode(packet: RemoveNodeIn) {
    const blueprint = this.getBlueprint(packet.blueprintId);
    const data = removeNodeFromTree(packet.nodeId, blueprint.nodes.map(el => el.id), blueprint.relationships.map(el => [el.parentId, el.childId, el.id]));
    blueprint.nodes = blueprint.nodes.filter(el => !data.nodes.includes(el.id));
    blueprint.relationships = blueprint.relationships.filter(el => !data.rels.includes(el.id));
    this.saveData();
  }
  public addBlueprintRelation(packet: CreateRelationIn) {
    this.getBlueprint(packet.blueprint).relationships.push(packet.relation);
  }
  public removeBlueprintRelation(packet: RemoveRelationIn) {
    const index = this.getBlueprint(packet.blueprint).relationships.findIndex(el => el.id === packet.blueprint);
    this.getBlueprint(packet.blueprint).relationships.splice(index, 1);
  }
  public updateBlueprintTags(tabId: string, tags: Tag[]) {
    this.openBlueprints[tabId].tags = tags;
    const docId = this.openBlueprints[tabId].id;
    this.data.blueprints.find(el => el.id == docId).tags = tags;
    for (const tag of tags) {
      if (!this.data.tags.find(el => el.title.toLowerCase() === tag.title.toLowerCase()))
        this.data.tags.push(tag);
    }
    // console.log(this.data.blueprints.find(el => el.id == docId).tags.length, tags.length);
    this.saveData();
  }
  public setSumarryNode(packet: EditSummaryIn) {
    this.getBlueprint(packet.blueprint).nodes.find(el => el.id === packet.node).summary = packet.content;
  }

  public async searchFromTags(tags: Tag[], needle?: string) {
    return await this.searchWorker.postAsyncMessage<Element[]>('searchFromTags', [tags, needle, [...this.docs, ...this.blueprints]]);
  }
  public async filterSecondaryTags(tags: Tag[]) {
    return await this.searchWorker.postAsyncMessage<Tag[]>('filterSecondaryTags', [tags, [...this.docs, ...this.blueprints]]);
  }

  public saveData() {
    setTimeout(() => localStorage.setItem("project-data", JSON.stringify(this.data)), 0);
  }
  public exit() {
    localStorage.removeItem("project-data");
    localStorage.removeItem("project");
    localStorage.removeItem("tab-index");
    this.router.navigateByUrl("/menu");
  }

  public set projectUsers(users: User[]) {
    this.data.users = users;
    this.saveData();
  }

  public get tags(): Tag[] {
    return this.data.tags;
  }
  public get owner(): User {
    return this.data.createdBy;
  }
  public get id(): number {
    return this.data.id;
  }
  public get docs(): Document[] {
    return this.data.documents || [];
  }
  public get blueprints(): Blueprint[] {
    return this.data.blueprints || [];
  }
  public get dispGrid(): boolean {
    return localStorage.getItem("disp-grid") !== "false";
  }
  public set dispGrid(opt: boolean) {
    localStorage.setItem("disp-grid", String(opt));
  }
  public get autoMode(): boolean {
    return localStorage.getItem("auto-mode") !== "false";
  }
  public set autoMode(opt: boolean) {
    localStorage.setItem("auto-mode", String(opt));
  }
  public get zoomScroll() {
    return localStorage.getItem("zoom-scroll") !== "false";
  }
  public set zoomScroll(opt: boolean) {
    localStorage.setItem("zoom-scroll", String(opt));
  }
  public getDoc(docId: number) {
    return Object.values(this.openDocs).find(el => el.id == docId);
  }
  public getBlueprint(blueprintId: number) {
    return Object.values(this.openBlueprints).find(el => el.id == blueprintId);
  }
  public getSheet(sheetId: number) {
    return Object.values(this.openSheets).find(el => el.id == sheetId);
  }
}
