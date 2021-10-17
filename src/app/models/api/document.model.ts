import { ContentElement, DataType } from "../default.model";
import { Change } from "../sockets/in/element.in";
import { Sheet } from "./sheet.model";
import { Tag } from "./tag.model";

export class Document extends ContentElement {

  public tags: Tag[];

  public sheets: Sheet[];

  readonly type = DataType.Document;
}

export class DocumentSock extends Document {
  public elIndex?: number;
  public changes: Map<number, Change[]>;
  public lastChangeId: number;
  public clientUpdateId?: number;
}