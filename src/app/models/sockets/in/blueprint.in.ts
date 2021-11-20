import { Node, Relationship } from "../../api/blueprint.model";
import { EditSummaryOut, PlaceNodeOut, RemoveNodeOut } from "../out/blueprint.out";

export class CreateNodeIn {
  constructor(
    public node: Node,
    public user: string
  ) {
  }
}
export class CreateRelationIn {
  constructor(
    public blueprint: number,
    public relation: Relationship
  ) { }
}

export class RemoveRelationIn {
  constructor(
    public blueprint: number,
    public parentNode: number,
    public childNode: number
  ) {}
}

export type PlaceNodeIn = PlaceNodeOut;
export type RemoveNodeIn = RemoveNodeOut;
export type EditSummaryIn = EditSummaryOut;