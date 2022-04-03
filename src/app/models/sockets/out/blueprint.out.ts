import { Pole } from "../../api/blueprint.model";

export class CreateNodeOut {
  constructor(
    public parentNode: number,
    public blueprint: number,
    public x: number,
    public y: number,
    public ox: number,
    public oy: number,
    public relYOffset: number,
    public parentPole: Pole,
    public childPole: Pole,
    public locked?: boolean
  ) { }
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