import { Element } from "../../default.model";

export class OpenElementIn {
  constructor(
    public userId: string,
    public element: Element
  ) {}
}
export class SendElementIn {
  constructor(
    public element: Element,
    public lastUpdate: number,
    public reqId: string
  ) {}
}

export class ElementStore {
  public updated: boolean = true;
  public content: string;
  public lastId: number = 0;
  public readonly clientsUpdateId: Map<string, number> = new Map();
  public readonly updates: Map<number, Change[]> = new Map();
  constructor(
    public elementId: number,
    public parentId?: number
  ) { }
  
  public addUpdate(changes: Change[], clientId: string, clientUpdateId: number): number {
    this.updates.set(++this.lastId, changes);
    this.clientsUpdateId.set(clientId, clientUpdateId);
    if (this.updates.size === 30)
      this.updates.delete(this.lastId - 29);
    return this.lastId;
  }
}
export type Change = [1 | -1 | 2, number, string]; 

export class WriteElementIn {
  
  constructor(
    public elementId: number,
    public userId: string,
    public updateId: number,
    public changes: Change[],
    public lastClientUpdateId: number
  ) { }
}
export class CloseElementIn {
  constructor(
    public userId: string,
    public elementId: number
  ) {}
}


export class RenameElementIn {
  constructor(
    public elementId: number,
    public title: string
  ) { }
}

export class ColorElementIn {
  constructor(
    public elementId: number,
    public color: string,
  ) { }
}