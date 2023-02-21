
import { Sheet } from './../models/api/sheet.model';
import { TabService } from './tab.service';
import { Router } from '@angular/router';
import { Project, User } from './../models/api/project.model';
import { Injectable } from '@angular/core';
import { removeNodeFromTree } from '../utils/tree.utils';
import { BlueprintComponent } from '../components/tabs/blueprint/blueprint.component';
import { WorkerManager, WorkerType } from '../utils/worker-manager.utils';
import { Document, DocumentSock } from '../models/api/document.model';
import { Blueprint, BlueprintSock, Node, Relationship, RelationshipType } from '../models/api/blueprint.model';
import { Tag } from '../models/api/tag.model';
import { SheetSock } from '../models/api/sheet.model';
import { Change, OpenElementIn, SendElementIn, WriteElementIn } from '../models/sockets/in/element.in';
import { CreateNodeIn, CreateRelationIn, EditSummaryIn, PlaceNodeIn, RemoveNodeIn, RemoveRelationIn } from '../models/sockets/in/blueprint.in';
import { Element } from '../models/default.model';
import { DataUpdater } from '../decorators/data-updater.decorator';
import { applyTextChanges } from '../utils/element.utils';
import { SearchOptionsComponent } from '../components/views/board/nav-bar/search-options/search-options.component';
import { NGXLogger } from 'ngx-logger';
import { TabTypes } from '../models/sys/tab.model';
import { DocumentComponent } from '../components/tabs/document/document.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public openBlueprints: { [k: string]: BlueprintSock } = {};
  public openSheets: { [k: string]: SheetSock } = {};

  public searchComponent!: SearchOptionsComponent;

  private searchWorker: WorkerManager;
  constructor(
    private readonly router: Router,
    private readonly tabs: TabService,
    private readonly logger: NGXLogger,
  ) {
    this.searchWorker = new WorkerManager(WorkerType.Search, this.logger);
  }

  private data = new Project(JSON.parse(localStorage.getItem("project-data")!, JSON.dateParser));
  public async loadData(data: Project) {
    this.data = data;
    localStorage.setItem("project-data", JSON.stringify(data));
    // this.openDocs = {};
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
  @DataUpdater()
  public addProjectUser(user: User) {
    this.data.users.push(user);
  }
  @DataUpdater()
  public removeProjectUser(user: User) {
    const index = this.data.users.findIndex(el => el.id == user.id);
    this.data.users.splice(index, 1);
  }
  @DataUpdater()
  public addProjectTag(tag: Tag) {
    this.data.tags.push(tag);
  }
  @DataUpdater()
  public removeProjectTag(name: string) {
    this.data.tags.splice(this.tags.findIndex(el => el.title === name), 1);
    for (const doc of this.data.documents)
      doc.tags.splice(doc.tags.findIndex(el => el.title === name), 1);
  }
  @DataUpdater()
  public updateProjectTag(tag: Tag, newTag?: Tag) {
    const index = this.tags.findIndex(el => el.title === tag.title);
    this.data.tags[index] = newTag ?? tag;
  }

  @DataUpdater()
  public addSendDoc(packet: SendElementIn) {
    const id = packet.lastUpdate;
    const document = new DocumentSock(packet.element);
    document.lastChangeId = id;
    document.changes = new Map<number, Change[]>();
    document.clientUpdateId = 0;
    this.logger.log("Document received:", packet.element.id, "tab:", packet.reqId);
    const docTab: DocumentComponent = this.tabs.getTabFromId(packet.reqId);
    docTab.doc = document;
    docTab.loadedTab();
    if (!this.data.documents.find(el => el.id == packet.element.id)) {
      this.data.documents.push(document);
    }
  }
  /**
   * Add a doc to the local data if the doc has been created
   */
  @DataUpdater()
  public addOpenDoc(packet: OpenElementIn) {
    if (!this.data.documents.find(el => el.id == packet.element.id))
      this.data.documents.push(new Document(packet.element));
  }

  public updateDoc(incomingDoc: WriteElementIn) {
    const tab = this.getDocComponent(incomingDoc.elementId);
    if (tab)
      tab.doc.content = applyTextChanges(tab.doc, incomingDoc);
  }

  @DataUpdater()
  public renameDocFromSocket(title: string, docId: number) {
    this.data.documents.find(el => el.id == docId)!.title = title;
    const tab = this.getDocComponent(docId);
    if (tab)
      tab.doc.title = title;
  }
  @DataUpdater()
  public renameDoc(tabId: string, title: string) {
    const tab: DocumentComponent = this.tabs.getTabFromId(tabId)
    tab.doc.title = title;
    const docId = tab.id;
    this.data.documents.find(el => el.id == docId)!.title = title;
  }
  @DataUpdater()
  public colorDoc(tabId: string, color: string) {
    const tab: DocumentComponent = this.tabs.getTabFromId(tabId)
    tab.doc.color = color;
    const docId = tab.id;
    this.data.documents.find(el => el.id == docId)!.color = color;
  }
  /**
   * Remove a doc from its docId
   * If it is tab id it means that the doc should be opened
   */
  @DataUpdater()
  public removeDoc(id: number) {
    this.data.documents.splice(this.docs.findIndex(el => el.id == id), 1);
  }
  @DataUpdater()
  public updateDocTags(tabId: string, tags: Tag[]) {
    const tab: DocumentComponent = this.tabs.getTabFromId(tabId)
    tab.doc.tags = tags;
    const docId = tab.id;
    this.data.documents.find(el => el.id == docId)!.tags = tags;
    for (const tag of tags) {
      if (!this.data.tags.find(el => el.title.toLowerCase() === tag.title.toLowerCase()))
        this.data.tags.push(tag);
    }
  }
  @DataUpdater()
  public addSendBlueprint(packet: SendElementIn) {
    this.logger.log("Blueprint received:", packet.element.id, "tab:", packet.reqId);
    const blueprint = this.openBlueprints[packet.reqId] = new BlueprintSock(packet.element);
    if (!this.data.blueprints.find(el => el.id == blueprint.id)) {
      this.data.blueprints.push(blueprint);
    }
    this.tabs.getTabFromId(packet.reqId).loadedTab();
  }
  /**
   * Add a doc to the local data if the doc has been created
   */
  @DataUpdater()
  public addOpenBlueprint(packet: OpenElementIn) {
    if (!this.data.blueprints.find(el => el.id == packet.element.id)) {
      this.data.blueprints.push(new Blueprint(packet.element));
    }
  }

  public removeOpenBlueprint(blueprintId: number) {
    const index = Object.values(this.openBlueprints).findIndex(el => el.id == blueprintId);
    delete this.openBlueprints[index];
  }

  @DataUpdater()
  public renameBlueprintFromSocket(title: string, blueprintId: number) {
    this.data.blueprints.find(el => el.id == blueprintId)!.title = title;
    const blueprint = Object.values(this.openBlueprints).find(el => el.id == blueprintId);
    if (blueprint)
      blueprint.title = title;
  }

  @DataUpdater()
  public renameBlueprint(tabId: string, title: string) {
    this.openBlueprints[tabId].title = title;
    const docId = this.openBlueprints[tabId].id;
    this.data.blueprints.find(el => el.id == docId)!.title = title;
  }

  @DataUpdater()
  public colorBlueprint(tabId: string, color: string) {
    this.openBlueprints[tabId].color = color;
    const docId = this.openBlueprints[tabId].id;
    this.data.blueprints.find(el => el.id == docId)!.color = color;
  }
  /**
   * Remove a blueprint from its tab id or docId
   * If it is tab id it means that the doc should be opened
   */
  @DataUpdater()
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
  }

  @DataUpdater()
  public async addBlueprintNode(packet: CreateNodeIn) {
    const blueprint = this.getBlueprint(packet.node.blueprint.id);
    if (blueprint)
      blueprint.nodesMap.set(packet.node.id, new Node(packet.node));
    this.logger.log("Node created:", packet.node.id, "blueprint:", packet.node.blueprint.id, packet.node);
    if (this.tabs.focusedTab.type === TabTypes.BLUEPRINT && this.tabs.focusedTab.id === packet.node.blueprint.id && packet.user === packet.node.createdBy.id) {
      window.setTimeout(async () => {
        const component = this.tabs.focusedTab as BlueprintComponent;
        if (component.autoMode)
          await component.autoPos(packet.node);
      }, 100);
    }
  }

  @DataUpdater()
  public placeBlueprintNode(packet: PlaceNodeIn) {
    const node = this.getBlueprint(packet.blueprintId)!.nodesMap.get(packet.id)!;
    if (node) {
      node.x = packet.pos[0];
      node.y = packet.pos[1];
    }
  }
  @DataUpdater()
  public removeBlueprintNode(packet: RemoveNodeIn) {
    const blueprint = this.getBlueprint(packet.blueprintId);
    if (!blueprint) return;
    const data = removeNodeFromTree(packet.nodeId, blueprint.nodesArr, blueprint.relsArr);
    for (const node of blueprint.nodesArr.filter(el => !data.nodes.includes(el)))
      blueprint.nodesMap.delete(node.id);
    for (const rel of blueprint.relsArr.filter(el => !data.rels.includes(el)))
      blueprint.relsMap.delete(rel.id);

  }
  public addBlueprintRelation(packet: CreateRelationIn) {
    if (packet.relation.type == RelationshipType.Direct)
      this.getBlueprint(packet.blueprint)!.relsMap.set(packet.relation.id, new Relationship(packet.relation));
    else
      this.getBlueprint(packet.blueprint)!.loopbackRelsMap.set(packet.relation.id, new Relationship(packet.relation));
  }
  //Todo: Check potential issue
  public removeBlueprintRelation(packet: RemoveRelationIn) {
    // const index = this.getBlueprint(packet.blueprint)!.relationships.findIndex(el => el.id === packet.blueprint);
    this.getBlueprint(packet.blueprint)!.relsMap.delete(packet.blueprint);

  }

  @DataUpdater()
  public updateBlueprintTags(tabId: string, tags: Tag[]) {
    this.openBlueprints[tabId].tags = tags;
    const docId = this.openBlueprints[tabId].id;
    this.data.blueprints.find(el => el.id == docId)!.tags = tags;
    for (const tag of tags) {
      if (!this.data.tags.find(el => el.title.toLowerCase() === tag.title.toLowerCase()))
        this.data.tags.push(tag);
    }
  }
  public setSumarryNode(packet: EditSummaryIn) {
    this.getBlueprint(packet.blueprint).nodesMap.get(packet.node)!.summary = packet.content;
    // this.getBlueprint(packet.blueprint)!.nodes.find(el => el.id === packet.node)!.summary = packet.content;
  }


  @DataUpdater()
  public addSendSheet(packet: SendElementIn) {
    const id = packet.lastUpdate;
    const sheet = new SheetSock(packet.element);
    sheet.lastChangeId = id;
    sheet.changes = new Map<number, Change[]>();
    sheet.clientUpdateId = 0;
    this.openSheets[packet.reqId] = sheet;
    const parentDoc = this.data.documents.find(el => el.id === sheet.documentId);
    if (!parentDoc.sheets?.find(el => el.id === sheet.id)) {
      (parentDoc.sheets ??= []).push(sheet);
    }
    this.logger.log("Sheet received:", packet.element.id, "doc:", parentDoc.id, "tab:", packet.reqId);
  }
  @DataUpdater()
  public addOpenSheet(sheet: Sheet) {
    const doc = this.data.documents.find(el => el.id == sheet.documentId);
    if (doc && !doc.sheets.find(el => el.id == sheet.id))
      doc.sheets.push(sheet);
  }

  public updateSheet(incomingSheet: WriteElementIn) {
    const sheet = this.getSheet(incomingSheet.elementId);
    if (sheet)
      sheet.content = applyTextChanges(sheet, incomingSheet);
  }

  /**
   * Remove a sheet from its ID
   * @param id the ID of the sheet
   * @param docId the ID of the document
   */
  @DataUpdater()
  public removeSheet(id: number, docId: number) {
    const tab = this.getDocComponent(docId);
    if (!tab) {
      this.logger.error("Sheet removal failed: Document not found:", docId, "sheet:", id);
      return;
    }
    const sheetIndex = tab.sheets.findIndex(el => el.id === id);
    if (sheetIndex === -1) {
      this.logger.error("Sheet removal failed: Sheet not found:", id, "doc:", docId);
      return;
    }
    tab.sheets.splice(sheetIndex, 1);
    delete this.openSheets[tab.tabId];
    const sheets = this.data.documents.find(el => tab.id === el.id)!.sheets;
    sheets.splice(sheets.findIndex(el => el.id == id), 1);
    this.logger.log("Sheet removed:", id, "doc:", docId);
  }

  public async searchFromTags(tags: Tag[], needle?: string, selectNoTags = false) {
    return await this.searchWorker.postAsyncMessage<Element[]>('searchFromTags', [tags, needle, [...this.docs, ...this.blueprints], selectNoTags]);
  }
  public async filterSecondaryTags(tags: Tag[]) {
    return await this.searchWorker.postAsyncMessage<Tag[]>('filterSecondaryTags', [tags, [...this.docs, ...this.blueprints]]);
  }

  public saveData() {
    setTimeout(() => localStorage.setItem("project-data", JSON.stringify(this.data)), 0);
  }
  public exit() {
    this.logger.log("Exiting current project:", this.id, this.name);
    localStorage.removeItem("project-data");
    localStorage.removeItem("project");
    localStorage.removeItem("tab-index");
    this.router.navigateByUrl("/menu");
  }

  public set projectUsers(users: User[]) {
    this.data.users = users;
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
  public getDocComponent(docId: number): DocumentComponent {
    return this.tabs.getTab(TabTypes.DOCUMENT, docId);
  }
  public getBlueprint(blueprintId: number) {
    return Object.values(this.openBlueprints).find(el => el.id == blueprintId);
  }
  public getSheet(sheetId: number) {
    return Object.values(this.openSheets).find(el => el.id == sheetId);
  }
}
