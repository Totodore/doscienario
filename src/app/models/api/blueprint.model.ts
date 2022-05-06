import { Change } from 'diff';
import { Vector } from 'src/types/global';
import { DataModel, DataType, Element } from '../default.model';
import { Tag } from './tag.model';
export class Blueprint extends Element {
  public nodes: Node[];
  public relationships: Relationship[];
  public tags: Tag[];
  public readonly type = DataType.Blueprint;
}

export class BlueprintSock extends Blueprint {
  public readonly nodesMap = new Map<number, Node>();
  public readonly relsMap = new Map<number, Relationship>();

  public nodes: never;
  public relationships: never;

  constructor(obj?: Partial<any & BlueprintSock>) {
    super(obj);
    for (const node of this.nodes as Node[]) {
      this.nodesMap.set(node.id, new Node(node));
    }
    for (const rel of this.relationships as Relationship[]) {
      this.relsMap.set(rel.id, new Relationship(rel));
    }
    this.nodes = undefined as never;
    this.relationships = undefined as never;
  }

  public get nodesArr(): Node[] {
    return Array.from(this.nodesMap.values());
  }
  public get relsArr(): Relationship[] {
    return Array.from(this.relsMap.values());
  }
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

  public get bounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width || 0,
      height: this.height || 0
    };
  }
}


export class Relationship extends DataModel<Relationship> {
  public id: number;
  public parentId: number;
  public childId: number;
  public blueprint: Blueprint;
  public parentPole: Pole;
  public childPole: Pole;

  public getOrigin(nodeBounds: Bounds): Vector {
    return this.computePositions(this.parentPole, nodeBounds);
  }
  public getDestination(nodeBounds: Bounds): Vector {
    return this.computePositions(this.childPole, nodeBounds);
  }

  private computePositions(pole: Pole, nodeBounds: Bounds): Vector {
    switch (pole) {
      case Pole.North:
        return [nodeBounds.x + nodeBounds.width / 2, nodeBounds.y - nodeBounds.height / 2];
      case Pole.South:
        return [nodeBounds.x + nodeBounds.width / 2, nodeBounds.y + nodeBounds.height / 2];
      case Pole.East:
        return [nodeBounds.x + nodeBounds.width, nodeBounds.y];
      case Pole.West:
        return [nodeBounds.x, nodeBounds.y];
    }

  }
}

export enum Pole {
  North = "N",
  South = "S",
  East = "E",
  West = "W"
}
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}