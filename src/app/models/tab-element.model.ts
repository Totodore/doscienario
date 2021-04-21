import { BlueprintService } from './../services/blueprint.service';
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
  refreshView?: () => void;
  onFocus?: () => void;
  onUnFocus?: () => void;
  blueprintHandler?: BlueprintService;
}

export enum TabTypes {
  DOCUMENT,
  BLUEPRINT,
  STANDALONE
}
