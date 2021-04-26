import { OpenBlueprintReq, SendBlueprintReq, CloseBlueprintReq, CreateNodeReq, RemoveNodeIn, CreateRelationReq, RemoveRelationReq, PlaceNodeIn, Relationship, EditSumarryIn, WriteNodeContentOut, WriteNodeContentIn } from './../models/sockets/blueprint-sock.model';
import { Tag, UpdateTagColorReq, UpdateTagNameReq } from './../models/sockets/tag-sock.model';
import { TabService } from './tab.service';
import { WriteDocumentReq, Change, DocumentModel, DocumentRes, WriteDocumentRes, RenameDocumentRes, EditTagDocumentReq, AddTagDocumentRes, OpenDocumentRes } from './../models/sockets/document-sock.model';
import { ProjectService } from 'src/app/services/project.service';
import { Flags } from './../models/sockets/flags.enum';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Socket, connect } from 'socket.io-client';
import { EventHandler, registerHandler } from '../decorators/subscribe-event.decorator';
import { Injectable } from '@angular/core';
import { UserDetailsRes } from '../models/api/user.model';
import { ProjectUserRes } from '../models/api/project.model';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: typeof Socket;
  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
    private readonly tabs: TabService
  ) {}

  connect() {
    this.socket = connect(`${environment.secured ? "wss" : "ws"}://${environment.apiUrl}`, {
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

  updateUserProject(users: ProjectUserRes[]) {
    const addedUser = users.filter(el => !this.project.projectUsers.find(value => el.id === value.id))?.[0];
    const removedUser = this.project.projectUsers.filter(el => !users.find(value => el.id === value.id))?.[0];
    if (addedUser)
      this.socket.emit(Flags.ADD_USER_PROJECT, addedUser);
    else if (removedUser)
      this.socket.emit(Flags.REMOVE_USER_PROJECT, removedUser);
  }

  @EventHandler(Flags.ADD_USER_PROJECT)
  onAddUserProject(user: UserDetailsRes) {
    this.project.addProjectUser(user);
  }

  @EventHandler(Flags.REMOVE_USER_PROJECT)
  onRemoveUserProject(user: UserDetailsRes) {
    this.project.removeProjectUser(user);
  }

  @EventHandler(Flags.OPEN_DOC)
  onOpenDocument(packet: OpenDocumentRes) {
    this.project.addOpenDoc(packet);
  }

  @EventHandler(Flags.SEND_DOC)
  onSendDocument(packet: DocumentRes) {
    this.project.addSendDoc(packet);
    this.tabs.updateDocTab(packet.reqId, packet.doc.id);
  }

  @EventHandler(Flags.CLOSE_DOC)
  onCloseDocument(docId: number) {
    this.project.removeOpenDoc(docId);
  }

  updateDocument(docId: number, tabId: string, changes: Change[], lastChangeId: number, clientUpdateId: number) {
    const doc = this.project.openDocs[tabId];
    console.log("Updating doc", docId, "tab", tabId);
    doc.changes.set(clientUpdateId, changes);
    this.socket.emit(Flags.WRITE_DOC, new WriteDocumentReq(changes, docId, lastChangeId, clientUpdateId, this.api.user.id));
  }

  @EventHandler(Flags.WRITE_DOC)
  onUpdateDocument(doc: WriteDocumentRes) {
    this.project.getDoc(doc.docId).lastChangeId = doc.updateId;
    if (doc.userId != this.api.user.id)
      this.project.updateDoc(doc);
  }

  @EventHandler(Flags.RENAME_DOC)
  onRenameDocument(doc: RenameDocumentRes) {
    this.project.renameDocFromSocket(doc.title, doc.docId);
  }

  @EventHandler(Flags.REMOVE_DOC)
  onRemoveDoc(docId: number) {
    this.tabs.removeDocTab(docId);
    this.project.removeDoc(docId);
  }

  @EventHandler(Flags.CREATE_TAG)
  onCreateTag(tag: Tag) {
    const projectTag = this.project.tags.find(el => el.name == tag.name);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(tag);
    else this.project.addProjectTag(tag);
  }

  @EventHandler(Flags.TAG_ADD_DOC)
  onAddTagDoc(packet: AddTagDocumentRes) {
    const projectTag = this.project.tags.find(el => el.name == packet.tag.name);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(packet.tag);
    else if (!projectTag)
      this.project.addProjectTag(packet.tag);
    const doc = this.project.getDoc(packet.docId);
    const tag = doc.tags.find(el => el.name == packet.tag.name);
    if (tag)
      doc.tags[doc.tags.indexOf(tag)] = packet.tag;
    else
      doc.tags.push(packet.tag);
  }

  @EventHandler(Flags.TAG_REMOVE_DOC)
  onRemoveTagDoc(packet: EditTagDocumentReq) {
    const tags = this.project.getDoc(packet.docId).tags;
    tags.splice(tags.findIndex(el => el.name == packet.name.toLowerCase()), 1);
  }

  @EventHandler(Flags.COLOR_TAG)
  onColorTag(packet: UpdateTagColorReq) {
    const newTag = this.project.tags.find(el => el.name === packet.name);
    newTag.color = packet.color;
    this.project.updateProjectTag(new Tag(packet.name), newTag);
  }

  @EventHandler(Flags.RENAME_TAG)
  onRenameTag(packet: UpdateTagNameReq) {
    const newTag = this.project.tags.find(el => el.name === packet.oldName);
    newTag.name = packet.name;
    this.project.updateProjectTag(new Tag(packet.oldName), newTag);
  }

  @EventHandler(Flags.REMOVE_TAG)
  onRemoveTag(tagName: string) {
    this.project.removeProjectTag(tagName);
  }

  @EventHandler(Flags.SEND_BLUEPRINT)
  onSendBlueprint(packet: SendBlueprintReq) {
    this.project.addSendBlueprint(packet);
    this.tabs.updateBlueprintTab(packet.reqId, packet.blueprint.id);
  }

  @EventHandler(Flags.OPEN_BLUEPRINT)
  onOpenBlueprint(packet: OpenBlueprintReq) {
    this.project.addOpenBlueprint(packet)
  }

  @EventHandler(Flags.CLOSE_BLUEPRINT)
  onCloseBlueprint(packet: CloseBlueprintReq) {
    this.project.removeOpenBlueprint(packet.id);
  }

  @EventHandler(Flags.REMOVE_BLUEPRINT)
  onRemoveBlueprint(id: number) {
    this.tabs.removeBlueprintTab(id);
    this.project.removeBlueprint(id);
  }
  @EventHandler(Flags.TAG_ADD_BLUEPRINT)
  onAddTagBlueprint(packet: AddTagDocumentRes) {
    const projectTag = this.project.tags.find(el => el.name == packet.tag.name);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(packet.tag);
    else if (!projectTag)
      this.project.addProjectTag(packet.tag);
    const doc = this.project.getBlueprint(packet.docId);
    const tag = doc.tags.find(el => el.name == packet.tag.name);
    if (tag)
      doc.tags[doc.tags.indexOf(tag)] = packet.tag;
    else
      doc.tags.push(packet.tag);
  }

  @EventHandler(Flags.TAG_ADD_BLUEPRINT)
  onRemoveTagBlueprint(packet: EditTagDocumentReq) {
    const tags = this.project.getBlueprint(packet.docId).tags;
    tags.splice(tags.findIndex(el => el.name == packet.name.toLowerCase()), 1);
  }
  
  @EventHandler(Flags.CREATE_NODE)
  onCreateNode(packet: CreateNodeReq) {
    this.project.addBlueprintNode(packet);
  }
  @EventHandler(Flags.PLACE_NODE)
  onPlaceNode(packet: PlaceNodeIn) {
    this.project.placeBlueprintNode(packet);
  }
  @EventHandler(Flags.PLACE_RELATIONSHIP)
  onPlaceRel(packet: Relationship) {
    this.project.placeBlueprintRel(packet);
  }
  @EventHandler(Flags.REMOVE_NODE)
  onRemoveNode(packet: RemoveNodeIn) {
    this.project.removeBlueprintNode(packet);
  }
  @EventHandler(Flags.CREATE_RELATION)
  onCreateRelation(packet: CreateRelationReq) {
    this.project.addBlueprintRelation(packet);
  }

  @EventHandler(Flags.REMOVE_RELATION)
  onRemoveRelation(packet: RemoveRelationReq) {
    this.project.removeBlueprintRelation(packet);
  }

  @EventHandler(Flags.SUMARRY_NODE)
  onSumarryNode(packet: EditSumarryIn) {
    this.project.setSumarryNode(packet);
  }

  
  @EventHandler(Flags.CONTENT_NODE)
  onUpdateNode(packet: WriteNodeContentIn) {
    if (packet.userId != this.api.user.id)
      this.project.updateNode(packet);
  }

  updateNode(nodeId: number, tabId: string, changes: Change[], blueprintId: number) {
    const doc = this.project.openBlueprints[tabId].nodes.find(el => el.id === nodeId);
    console.log("Updating blueprint node", nodeId, "tab", tabId);
    this.socket.emit(Flags.CONTENT_NODE, new WriteNodeContentOut(changes, nodeId, this.api.user.id, blueprintId));
  }
}
