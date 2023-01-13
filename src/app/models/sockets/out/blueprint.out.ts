import { Pole, Relationship } from "../../api/blueprint.model";

export interface CreateNodeOut {
  parentNode: number,
  blueprint: number,
  x: number,
  y: number,
  ox: number,
  oy: number,
  relYOffset: number,
  parentPole: Pole,
  childPole: Pole,
  locked?: boolean,
  childRel?: number;
}
export class RemoveRelationOut {
  constructor(
    public blueprint: number,
    public parentNode: number,
    public childNode: number
  ) { }
}
export class EditSummaryOut {
  constructor(
    public node: number,
    public content: string,
    public blueprint: number
  ) { }
}
export class PlaceNodeOut {
  constructor(
    public blueprintId: number,
    public id: number,
    public pos: [number, number]
  ) { }
}
export class RemoveNodeOut {
  constructor(
    public nodeId: number,
    public blueprintId: number
  ) { }
}
export class RemoveRelOut {
  constructor(
    public relId: number,
    public blueprintId: number
  ) { }
}
export class ColorNodeOut {
  constructor(
    public blueprintId: number,
    public elementId: number,
    public color: string,
  ) {}
}