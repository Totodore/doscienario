import { Change } from "../in/element.in";

export class ColorElementOut {
  constructor(
    public elementId: number,
    public color: string,
  ) { }
}

export class WriteElementOut {

  constructor(
    public elementId: number,
    public lastUpdateId: number,
    public changes: Change[],
    public clientId: string,
    public clientUpdateId: number,
  ) { }
}

export class RenameElementOut {
  constructor(
    public elementId: number,
    public title: string
  ) { }
}

export class CheckCRCOut {
  constructor(
    public elId: number,
    public crc: number,
  ) { }
}