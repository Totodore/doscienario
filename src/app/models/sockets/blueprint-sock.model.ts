import { Change } from './document-sock.model';
import { DataType, Element, IElement } from './../default.model';
import { Project, User } from "../api/project.model";
import { Tag } from "./tag-sock.model";
import { DataModel } from "../default.model";

export class Blueprint extends Element implements IElement {

  nodes: Node[];
  relationships: Relationship[];
  x: number;
  y: number;

  readonly type = DataType.Blueprint;
}

export class Node extends DataModel<Node> {
  public id: number;
  public x: number;
  public y: number;
  public isRoot: boolean;
  public content: string;
  public summary: string;
  public title: string;
  public blueprintId: number;
  public blueprint: Blueprint;
  public tags: Tag[];
  public locked: boolean;
  public height?: number;
  public width?: number;
  public changes?: Map<number, Change[]>;
}

export class Relationship extends DataModel<Relationship> {
  public id: number;
  public parentId: number;
  public childId: number;
  public blueprint: Blueprint;
  public ox: number;
  public oy: number;
  public ex: number;
  public ey: number;
}

export class PlaceNodeOut {
  constructor(
    public blueprintId: number,
    public id: number,
    public pos: [number, number]
  ) {}
}
export class PlaceNodeIn extends PlaceNodeOut { };

export class SendBlueprintReq {
  constructor(
    public blueprint: Blueprint,
    public reqId: string
  ) { }
}
export class OpenBlueprintReq {
  constructor(
    public blueprint: Blueprint,
    public user: string
  ) { }
}
export class CloseBlueprintReq {
  constructor(
    public user: string,
    public id: number
  ) { }
}

export class CreateNodeRes {
  constructor(
    public parentNode: number,
    public blueprint: number,
    public x: number,
    public y: number,
    public ox: number,
    public oy: number,
    public relYOffset: number,
    public locked?: boolean
  ) { }
}
export class CreateNodeReq {

  constructor(
    public node: Node,
    public user: string
  ) { }
}
export class RemoveNodeIn {
  constructor(
    public nodeId: number,
    public blueprintId: number
  ) {}
}
export class RemoveNodeOut extends RemoveNodeIn { }
export class RenameBlueprintOut {
  constructor(
    public id: number,
    public title: string
  ) {}
}
export class CreateRelationReq {
  constructor(
    public blueprint: number,
    public relation: Relationship
  ) { }
}
export class RemoveRelationReq {
  constructor(
    public blueprint: number,
    public id: number
  ) {}
}

export class EditSumarryOut {
  constructor(
    public node: number,
    public content: string,
    public blueprint: number
  ) {}
}
export type EditSumarryIn = EditSumarryOut;

export class WriteNodeContentOut {
  constructor(
    public changes: Change[],
    public nodeId: number,
    public userId: string,
    public blueprintId: number
  ) {}
}
export type WriteNodeContentIn = WriteNodeContentOut;
