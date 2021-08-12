import { Document } from "../api/project.model";
import { UserDetailsRes } from "../api/user.model";
import { DataType } from "../default.model";
import { Tag } from "./tag-sock.model";

export interface DocumentModel {
  title: string;
  content: string,
  id: number,
  lastEditor: UserDetailsRes,
  createdBy: UserDetailsRes,
  lastEditing: string;
  createdDate: string;
  tags: Tag[];
  elIndex?: number;
  changes: Map<number, Change[]>;
  lastChangeId: number;
  clientUpdateId?: number;
  readonly type: DataType.Document;
}
export interface DocumentRes {
  doc: DocumentModel;
  lastUpdate: number;
  reqId: string;
}
export class WriteDocumentReq {

  constructor(
    public changes: Change[],
    public docId: number,
    public lastChangeId: number,
    public clientUpdateId: number,
    public clientId: string
  ) {}
}

export interface WriteDocumentRes {
  docId: number;
  userId: string;
  updateId: number;
  reqId: string;
  changes: Change[];
  lastClientUpdateId: number;
}
export type Change = [1 | -1 | 2, number, string];

export class RenameDocumentReq {
  constructor(
    public docId: number,
    public title: string,
  ) {}
}

export class RenameDocumentRes extends RenameDocumentReq { };

export class EditTagDocumentReq {
  constructor(
    public docId: number,
    public name: string
  ) {}
}

export class AddTagDocumentRes {
  constructor(
    public docId: number,
    public tag: Tag
  ) {}
}


export class OpenDocumentRes {
  constructor(
    public userId: string,
    public doc: Document
  ) {}
}
