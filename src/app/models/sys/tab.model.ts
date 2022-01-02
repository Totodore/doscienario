import { Component } from '@angular/core';
import { DbColumn, DbPrimaryGeneratedColumn, DbTable } from 'src/app/decorators/database-column.decorator';

@DbTable()
export class Tab {

  @DbPrimaryGeneratedColumn()
  public id: number;

  @DbColumn()
  public projectId: number;

  @DbColumn()
  public tabType: number;

  @DbColumn()
  public elId?: number | string = null;

  public tabId?: string;

  constructor(projectId: number, tabType: number, elId?: number | string) {
    this.projectId = projectId;
    this.tabType = tabType;
    this.elId = elId;
  }
}


export enum TabTypes {
  DOCUMENT,
  BLUEPRINT,
  STANDALONE
}


export interface ITabElement extends Component {
  title: string;
  tabId?: string;
  id?: number;
  show: boolean;
  type: TabTypes;
  onClose?: () => void;
  openTab?: (id: number | string) => string;
  loadedTab?: () => void;
  onFocus?: () => void;
  onUnFocus?: () => void;
}
