import { Change } from 'diff';
import { DataModel, DataType, Element } from '../default.model';
import { Tag } from './tag.model';
export class Blueprint extends Element {
  public nodes: Node[];
  public relationships: Relationship[];
  public x: number;
  public y: number;
  public tags: Tag[];
  public readonly type = DataType.Blueprint;
}


export class Node extends DataModel<Node> {
  public id: number;
  public x: number;
  public y: number;
  public isRoot: boolean;
  public content: string;
  public summary: string;
  public title: string;
  public blueprintId: number;
  public blueprint: Blueprint;
  public tags: Tag[];
  public locked: boolean;
  public height?: number;
  public width?: number;
  public changes?: Map<number, Change[]>;
}


export class Relationship extends DataModel<Relationship> {
  public id: number;
  public parentId: number;
  public childId: number;
  public blueprint: Blueprint;
  public ox: number;
  public oy: number;
  public ex: number;
  public ey: number;
}