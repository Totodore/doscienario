import { Component } from "@angular/core";

export interface ITabElement extends Component {
  title: string;
  id?: number;
  show: boolean;
  onRename?: () => void;
}
