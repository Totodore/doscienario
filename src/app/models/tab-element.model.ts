import { Component } from "@angular/core";

export interface ITabElement extends Component {
  title: string;
  tabId?: string;
  docId?: number;
  show: boolean;
  onClose?: () => void;
  openTab?: (id: number | string) => string;
}
