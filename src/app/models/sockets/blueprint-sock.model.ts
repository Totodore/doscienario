import { GetProjectRes, ProjectUserRes } from "../api/project.model";
import { Tag } from "./tag-sock.model";

export class Blueprint {
  id: number;

  name: string;

  nodes: Node[];

  createdDate: Date;

  project: GetProjectRes;

  createdBy: ProjectUserRes;

  tags: Tag[];

  lastEditor: ProjectUserRes;

  lastEditing: Date
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

  title: string;

  blueprintId: number;

  blueprint: Blueprint;

  parentsRelations: Relationship[];

  childsRelations: Relationship[];

  tags: Tag[];
}

export class Relationship {
  id: number;

  parentId: number

  childId: number;

  child: Node;

  parent: Node;
}

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
    public y: number
  ) { }
}
export class CreateNodeReq {

  constructor(
    public node: Node,
    public user: string
  ) { }
}
export class RemoveNodeReq {
  constructor(
    public id: number,
    public blueprint: number
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
    public parentNode: number,
    public childNode: number
  ) {}
}
