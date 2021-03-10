import { Component } from "@angular/core";

export interface ITabElement extends Component {
  title: string;
  tabId?: string;
  docId?: number;
  show: boolean;
  onRename?: () => void;
  openTab?: (id: number | string) => string;
}
