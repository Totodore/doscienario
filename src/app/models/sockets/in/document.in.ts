import { CursorDocumentOut } from './../out/document.out';

export class CursorDocumentIn {

  public docId: number;
  public pos: number;

  constructor(
    req: CursorDocumentOut,
    public userId: string,
  ) {
    this.docId = req.docId;
    this.pos = req.pos;
  }

}