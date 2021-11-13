import { Injectable } from '@angular/core';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { CloseElementIn, ColorElementIn, OpenElementIn, SendElementIn } from 'src/app/models/sockets/in/element.in';
import { AddTagElementIn, RemoveTagElementIn } from 'src/app/models/sockets/in/tag.in';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { TabService } from '../tab.service';
import { CreateNodeIn, CreateRelationIn, EditSummaryIn, PlaceNodeIn, RemoveNodeIn, RemoveRelationIn } from 'src/app/models/sockets/in/blueprint.in';
import { Relationship } from 'src/app/models/api/blueprint.model';

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
  onSendBlueprint(packet: SendElementIn) {
    this.project.addSendBlueprint(packet);
    this.tabs.updateBlueprintTab(packet.reqId, packet.element.id);
  }

  @EventHandler(Flags.OPEN_BLUEPRINT)
  onOpenBlueprint(packet: OpenElementIn) {
    this.project.addOpenBlueprint(packet)
  }

  @EventHandler(Flags.CLOSE_BLUEPRINT)
  onCloseBlueprint(packet: CloseElementIn) {
    this.project.removeOpenBlueprint(packet.elementId);
  }

  @EventHandler(Flags.COLOR_BLUEPRINT)
  onColorDoc(packet: ColorElementIn) {
    this.project.blueprints.find(el => el.id === packet.elementId).color = packet.color;
  }

  @EventHandler(Flags.REMOVE_BLUEPRINT)
  onRemoveBlueprint(id: number) {
    this.tabs.removeBlueprintTab(id);
    this.project.removeBlueprint(id);
  }
  @EventHandler(Flags.TAG_ADD_BLUEPRINT)
  onAddTagBlueprint(packet: AddTagElementIn) {
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

  @EventHandler(Flags.TAG_REMOVE_BLUEPRINT)
  onRemoveTagBlueprint(packet: RemoveTagElementIn) {
    const tags = this.project.getBlueprint(packet.elementId).tags;
    tags.splice(tags.findIndex(el => el.title == packet.title.toLowerCase()), 1);
  }

  @EventHandler(Flags.CREATE_NODE)
  onCreateNode(packet: CreateNodeIn) {
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
  onCreateRelation(packet: CreateRelationIn) {
    this.project.addBlueprintRelation(packet);
  }

  @EventHandler(Flags.REMOVE_RELATION)
  onRemoveRelation(packet: RemoveRelationIn) {
    this.project.removeBlueprintRelation(packet);
  }

  @EventHandler(Flags.SUMARRY_NODE)
  onSumarryNode(packet: EditSummaryIn) {
    this.project.setSumarryNode(packet);
  }
  public get socket() { return this.api.socket; }
}