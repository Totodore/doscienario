import { Vector } from './../../types/global.d';
import { Component } from "@angular/core";

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

export interface TabSaveModel {
  tab: number;
  projectId: number;
  id?: number;
  tabId?: string;
}

export enum TabTypes {
  DOCUMENT,
  BLUEPRINT,
  STANDALONE
}
