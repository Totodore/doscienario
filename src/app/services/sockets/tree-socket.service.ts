import { Injectable } from '@angular/core';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { CloseBlueprintReq, CreateNodeReq, CreateRelationReq, EditSumarryIn, OpenBlueprintReq, PlaceNodeIn, Relationship, RemoveNodeIn, RemoveRelationReq, SendBlueprintReq, WriteNodeContentIn, WriteNodeContentOut } from 'src/app/models/sockets/blueprint-sock.model';
import { AddTagDocumentRes, Change, EditTagDocumentReq } from 'src/app/models/sockets/document-sock.model';
import { ColorElementRes } from 'src/app/models/sockets/element-sock.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { TabService } from '../tab.service';

@Injectable({
  providedIn: 'root'
})
export class TreeSocketService {

  constructor(
    private readonly api: ApiService,
    private readonly project: ProjectService,
    private readonly tabs: TabService
  ) { }


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

  @EventHandler(Flags.COLOR_BLUEPRINT)
  onColorDoc(packet: ColorElementRes) {
    this.project.blueprints.find(el => el.id === packet.docId).color = packet.color;
  }

  @EventHandler(Flags.REMOVE_BLUEPRINT)
  onRemoveBlueprint(id: number) {
    this.tabs.removeBlueprintTab(id);
    this.project.removeBlueprint(id);
  }
  @EventHandler(Flags.TAG_ADD_BLUEPRINT)
  onAddTagBlueprint(packet: AddTagDocumentRes) {
    const projectTag = this.project.tags.find(el => el.title == packet.tag.title);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(packet.tag);
    else if (!projectTag)
      this.project.addProjectTag(packet.tag);
    const doc = this.project.getBlueprint(packet.docId);
    const tag = doc.tags.find(el => el.title == packet.tag.title);
    if (tag)
      doc.tags[doc.tags.indexOf(tag)] = packet.tag;
    else
      doc.tags.push(packet.tag);
  }

  @EventHandler(Flags.TAG_ADD_BLUEPRINT)
  onRemoveTagBlueprint(packet: EditTagDocumentReq) {
    const tags = this.project.getBlueprint(packet.docId).tags;
    tags.splice(tags.findIndex(el => el.title == packet.title.toLowerCase()), 1);
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

  public get socket() { return this.api.socket; }
}
