import { DataType, IElement } from 'src/app/models/default.model';
import { ContentElement } from "../default.model";
import { Change } from '../sockets/in/element.in';

export class Sheet extends ContentElement implements IElement {

  public documentId: number;
  public readonly type = DataType.Sheet;

}

export class SheetSock extends Sheet {
  public elIndex?: number;
  public changes: Map<number, Change[]>;
  public lastChangeId: number;
  public clientUpdateId?: number;
}