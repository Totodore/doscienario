import { Component, OnDestroy } from '@angular/core';
import { Observable, timeout, firstValueFrom } from 'rxjs';
import { CheckCRCIn } from './../../models/sockets/in/document.in';
import { Tag } from 'src/app/models/api/tag.model';
import { ITabElement, TabTypes } from 'src/app/models/sys/tab.model';
import { ProgressService } from 'src/app/services/ui/progress.service';
import { Vector } from 'src/types/global';
import { v4 as uuid4 } from "uuid";
import { NGXLogger } from 'ngx-logger';

@Component({ template: '' })
export abstract class ElementComponent implements ITabElement, OnDestroy {
  public tabId: string;
  public show = false;
  public type: TabTypes;
  public loaded = false;

  protected scroll: Vector;
  protected contentElement: HTMLElement;

  private crcReq: number[] = [];
  private crcError: boolean | null = null;
  private checkCRCErrorTimer: number;

  constructor(
    protected progress: ProgressService,
    protected logger: NGXLogger
  ) { }
  
  public ngOnDestroy(): void {
    window.clearTimeout(this.checkCRCErrorTimer);
  }

  public openTab(tabId: string, _id?: number): string {
    this.tabId = tabId;
    this.progress.show();
    return this.tabId;
  }
  public loadedTab(): void {
    this.progress.hide();
    this.loaded = true;
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

  protected async checkCRC() {
    const crc = await this.getCRC();
    if (crc == this.crcReq[this.crcReq.length - 1])
      return;
    this.crcReq.push(crc);
    if (this.crcReq.length > 10) {
      this.crcError = true;
    }
    try {
      const res = await firstValueFrom(this.sendCRCRequest(crc).pipe(timeout({ first: 2000 })));
      if (!res.isValid)
        throw new Error("CRC error bad check: " +  res.crc);
      this.crcError = false;
      this.crcReq.splice(this.crcReq.findIndex(c => c == crc), 1);
    } catch (e) {
      this.logger.error("CRC check error !!", e);
      this.crcError = true;
      this.crcReq.splice(this.crcReq.findIndex(c => c == crc), 1);
      this.checkCRCErrorTimer = window.setTimeout(() => this.checkCRC(), 1000);
    }
  }

  public generateUid() {
    return this.type + '-' + uuid4();
  }
  public abstract addTags(tags: Tag[]): Promise<void> | void;
  protected abstract getCRC(): Promise<number> | number;
  protected abstract sendCRCRequest(crc: number): Observable<CheckCRCIn>

  public get title(): string {
    return this.contentElement ? "Loading..." : "Unkown";
  }
  public abstract get id(): number;
}
