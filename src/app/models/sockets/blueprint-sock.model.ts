import { Change } from './document-sock.model';
import { DataType } from './../default.model';
import { GetProjectRes, ProjectUserRes } from "../api/project.model";
import { Tag } from "./tag-sock.model";
import { DataModel } from "../default.model";

export class Blueprint extends DataModel {
  id: number;

  name: string;

  nodes: Node[];

  relationships: Relationship[];

  createdDate: Date;

  project: GetProjectRes;

  createdBy: ProjectUserRes;

  tags: Tag[];

  lastEditor: ProjectUserRes;

  lastEditing: Date;

  x: number;
  y: number;

  readonly type = DataType.Blueprint;
}

export class Node {
  id: number;

  x: number;

  y: number;

  createdDate: Date;

  createdBy: ProjectUserRes;

  lastEditor: ProjectUserRes;

  lastEditing: Date

  isRoot: boolean;

  content: string;

  summary: string;
  
  title: string;

  blueprintId: number;

  blueprint: Blueprint;

  tags: Tag[];

  locked: boolean;

  height?: number;
  width?: number;
  changes?: Map<number, Change[]>;
}

export class Relationship extends DataModel {
  id: number;
  parentId: number;
  childId: number;
  blueprint: Blueprint;
  ox: number;
  oy: number;
  ex: number;
  ey: number;
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
    public oy: number
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
