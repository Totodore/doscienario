import { Vector } from 'src/types/global';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

  /**
   * The menu items to display
   */
  @Input()
  public menuItems: ContextMenuItem[] = [];

  @Input()
  public pos: Vector;

  @Output()
  public onClose: EventEmitter<void> = new EventEmitter();

  @HostListener('click')
  public onOverlayClick() {
    this.onClose.emit();
  }

  @HostListener('contextmenu')
  public onRightClick() {
    this.onClose.emit();
  }

  @HostListener('document:keydown.escape')
  public onEscape() {
    this.onClose.emit();
  }

  public onItemClick(item: ContextMenuItem) {
    this.onClose.emit();
    item.action();
  }

}


export type ContextMenuItem = {
  label: string;
  icon?: string;
  color?: string;
  action: () => void;
}