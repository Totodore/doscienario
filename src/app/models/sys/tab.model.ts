import { Component } from '@angular/core';
import { DbColumn, DbPrimaryColumn, DbPrimaryGeneratedColumn, DbTable, DbUniqueColumn } from 'src/app/decorators/database-column.decorator';

@DbTable()
export class Tab {

  @DbPrimaryColumn()
  public id: string;

  @DbColumn()
  public projectId: number;

  @DbColumn()
  public tabType: number;

  @DbColumn()
  public elId?: number = null;

  constructor(projectId: number, tabType: number, tabId: string, elId?: number) {
    this.projectId = projectId;
    this.tabType = tabType;
    this.elId = elId;
    this.id = tabId;
  }
}


export enum TabTypes {
  DOCUMENT,
  BLUEPRINT,
  STANDALONE
}


export interface ITabElement extends Component {
  title: string;
  tabId: string;
  id?: number;
  show: boolean;
  type: TabTypes;
  onClose?: () => void;
  generateUid: () => string;
  /**
   * Called when the tab is opened
   * @param id the element id to open
   */
  openTab?: (tabId?: string, id?: number) => void;
  loadedTab?: () => void;
  onFocus?: () => void;
  onUnFocus?: () => void;
}
