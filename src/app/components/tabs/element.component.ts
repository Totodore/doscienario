import { ITabElement, TabTypes } from 'src/app/models/tab-element.model';
import { ProgressService } from 'src/app/services/progress.service';
import { Vector } from 'src/types/global';
import { v4 as uuid4 } from "uuid";

export abstract class ElementComponent implements ITabElement {
  public tabId?: string;
  public show = false;
  public type: TabTypes;

  protected scroll: Vector;
  protected contentElement: HTMLElement;
  constructor(
    protected progress: ProgressService,
  ) { }

  public openTab(id: string | number): string {
    this.tabId = uuid4();
    this.progress.show();
    return this.tabId;
  }
  public loadedTab(): void {
    this.progress.hide();
  }
  public onClose(): void {
  }
  public onFocus(): void {
    if (this.contentElement) {
      window.setTimeout(() => {
        this.contentElement.scrollTo({ left: this.scroll?.[0], top: this.scroll?.[1], behavior: "auto" });
      });
    }
  }
  public onUnFocus(): void {
    this.scroll = [this.contentElement?.scrollLeft, this.contentElement?.scrollTop];
  }

  public get title(): string {
    return this.contentElement ? "Loading..." : "Unkown";
  }
}
