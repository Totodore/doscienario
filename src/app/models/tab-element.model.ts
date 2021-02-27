import { Component } from "@angular/core";

export interface ITabElement extends Component {
  title: string;
  show: boolean;
  onRename?: () => void;
}
