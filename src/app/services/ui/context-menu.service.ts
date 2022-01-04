import { ElectronService } from 'src/app/services/electron.service';
import { NGXLogger } from 'ngx-logger';
import { ContextMenuItem } from './../../components/utils/context-menu/context-menu.component';
import { Injectable } from '@angular/core';
import { Vector } from 'src/types/global';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  constructor(
    private readonly logger: NGXLogger,
    private readonly electron: ElectronService,
  ) { }

  private _showing = false;
  private _pos?: Vector;
  private _items: ContextMenuItem[];
  
  public show(e: MouseEvent, items: ContextMenuItem[]) {
    e.stopPropagation();
    e.preventDefault();
    if (!this._showing) {
      this._showing = true;
      this._pos = this.getCoordsFromEvent(e);
      this._items = items;
      this.logger.log("Showing context menu at:", this.pos.join(','), "with items:", items);
    }
  }

  public hide() {
    if (this._showing) {
      this._showing = false;
      this._items = [];
      this._pos = null;
      this.logger.log("Hiding context menu");
    }
  }

  public toggle(e?: MouseEvent, items?: ContextMenuItem[]) {
    if (!this._showing && e && items)
      this.show(e, items);
    else if (this._showing)
      this.hide();
  }

  public get showing(): boolean {
    return this._showing;
  }

  public get pos(): Vector {
    return this._pos || [0, 0];
  }

  public get items(): ContextMenuItem[] {
    return this._items || [];
  }

  /**
   * Get the coordinates of the mouse event for the context menu to be displayed
   * @param e The mouse event
   * @returns The coordinates of the mouse event [top, left] corners
   */
  private getCoordsFromEvent(e?: MouseEvent): Vector {
    if (!e)
      return [0, 0];
    return [e.clientY + (this.electron.isElectronApp ? -30 : 0), e.clientX];
  }

}

