import { UserDetailsRes } from "../api/user.model";

export interface DocumentModel {
  title: string;
  content: string,
  id: number,
  lastEditor: UserDetailsRes,
  createdBy: UserDetailsRes,
  lastEditing: string;
  createdDate: string;
  elIndex?: number;
  lastChangeId: number;
}
export interface DocumentRes {
  doc: DocumentModel;
  lastUpdate: number;
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
  change: Change[];
  lastClientUpdateId: number;
}
export type Change = [ 1 | 0 | -1, string | number, number? ];
