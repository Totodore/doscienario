import { Tab } from './../models/sys/tab.model';
import { DbService } from './database/db.service';

import { BlueprintComponent } from './../components/tabs/blueprint/blueprint.component';
import { WelcomeTabComponent } from './../components/tabs/welcome-tab/welcome-tab.component';
import { TagsManagerComponent } from './../components/tabs/tags-manager/tags-manager.component';
import { DocumentComponent } from './../components/tabs/document/document.component';
import { ProjectOptionsComponent } from '../components/tabs/project-options/project-options.component';
import { ComponentFactoryResolver, Inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ITabElement, TabTypes } from '../models/sys/tab.model';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  private _tabs: [Type<ITabElement>, ITabElement][] = [];
  private rootViewContainer: ViewContainerRef;
  private projectId: number;

  private readonly availableTabs: Type<ITabElement>[] = [
    ProjectOptionsComponent,
    DocumentComponent,
    BlueprintComponent,
    TagsManagerComponent,
    WelcomeTabComponent
  ];

  constructor(
    @Inject(ComponentFactoryResolver)
    private readonly factoryResolver: ComponentFactoryResolver,
    private readonly logger: NGXLogger,
    private readonly db: DbService
  ) { }

  public setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  private addDynamicComponent(el: Type<ITabElement>, id?: number): string {
    const factory = this.factoryResolver.resolveComponentFactory(el)
    const component = factory.create(this.rootViewContainer.injector);
    this._tabs.push([el, component.instance]);
    this.rootViewContainer.insert(component.hostView);
    component.instance.show = true;
    return component.instance.openTab?.(id);
  }

  public async loadSavedTabs(projectId: number) {
    this.projectId = projectId;
    for (const tab of (await this.getSavedTabs())) {
      this.pushTab(this.availableTabs[tab.tabType], false, tab.elId as number);
      this.logger.log("Loading saved tab :", this.availableTabs[tab.tabType].name);
    }
    this.showTab(this.focusedTabIndex);
  }

  /**
   * Take an id, it can be a document id (number)
   * or a tab id
   */
  public async pushTab(tab: Type<ITabElement>, save = true, id?: number): Promise<string> {
    if (this.displayedTab?.[1])
      this.displayedTab[1].show = false;
    let displayedIndex: number;
    const componentIndex = this._tabs.findIndex(el => id && el[1].id === id && el[0] === tab);
    if (id && componentIndex >= 0)
      displayedIndex = componentIndex;
    else if (this._tabs.find(el => el[0] === tab && el[1].type === TabTypes.STANDALONE))
      displayedIndex = this._tabs.findIndex(el => el[0].name === tab.name);
    this.logger.log(displayedIndex >= 0 ? `Tab already exists : ${displayedIndex}` : `Creating new tab for ${tab.name}`);
    if (displayedIndex >= 0)
      return this.showTab(displayedIndex);
    else {
      const tabId = this.addDynamicComponent(tab, id);
      if (save)
        await this.addTabToStorage(tab, id);
      return tabId;
    }
  }

  /**
   * If index is not given, it remove the current tab
   */
  public removeTab(index = this.displayedTab[0], storage = true) {
    this.tabs[index].onClose?.();
    if (this.tabs[index].show && this.tabs.length > 1) {
      (this.tabs[index - 1] ?? this.tabs[this.tabs.length - 1]).show = true;
      (this.tabs[index - 1] ?? this.tabs[this.tabs.length - 1]).onFocus?.();
    }
    if (storage)
      this.removeTabToStorage(this._tabs[index][0], this._tabs[index][1]?.id);
    this.rootViewContainer.remove(index);
    this._tabs.splice(index, 1);
  }
  public async updateDocTab(tabId: string, docId: number) {
    this.getTabFromId<DocumentComponent>(tabId).loadedTab?.();
    const savedTabs = await this.getSavedTabs();
    if (!savedTabs.find(el => el.tabType === this.availableTabs.indexOf(DocumentComponent) && el?.elId === docId))
      await this.addTabToStorage(DocumentComponent, docId);
  }
  public removeDocTab(docId: number) {
    const index = this.tabs.findIndex(el => el.id === docId && el.type === TabTypes.DOCUMENT);
    if (index >= 0)
      this.removeTab(index);
  }
  public async updateBlueprintTab(tabId: string, blueprintId: number) {
    this.getTabFromId<BlueprintComponent>(tabId).loadedTab?.();
    const savedTabs = await this.getSavedTabs();
    if (!savedTabs.find(el => el.tabType === this.availableTabs.indexOf(DocumentComponent) && el?.elId === blueprintId))
      await this.addTabToStorage(BlueprintComponent, blueprintId);
  }
  public removeBlueprintTab(docId: number) {
    const index = this.tabs.findIndex(el => el.id === docId && el.type === TabTypes.BLUEPRINT);
    if (index >= 0)
      this.removeTab(index);
  }
  public showTab(index: number, save = true) {
    if (this.displayedTab?.[1]) {
      this.displayedTab[1].onUnFocus?.();
      this.displayedTab[1].show = false;
    }
    if (this.tabs[index]) {
      this.tabs[index].show = true;
      this.tabs[index].onFocus?.();
    }
    if (save)
      this.focusedTabIndex = index;
    return this.displayedTab?.[1]?.tabId;
  }
  public showNextTab() {
    const index = this.focusedTabIndex >= this.tabs.length ? 0 : this.focusedTabIndex + 1;
    this.showTab(index);
  }
  public async closeAllTab(removeFromStorage = false) {
    const tabLength = this._tabs.length;
    for (let i = 0; i < tabLength; i++)
      this.removeTab(0);
    if (removeFromStorage) {
      await this.db.removeMany(Tab, await this.getSavedTabs());
    }
    localStorage.removeItem("tab-index");
  }
  public getTab<T extends ITabElement>(tabType: TabTypes, id: number): T {
    return this.tabs.find(el => el.type == tabType && el.id === id) as T;
  }
  public getTabFromId<T extends ITabElement>(tabId: string): T {
    return this.tabs.find(el => el.tabId === tabId) as T;
  }

  private async addTabToStorage(type: Type<ITabElement>, id?: number | string) {
    const index = this.availableTabs.indexOf(type);
    const tab = new Tab(this.projectId, index, id);
    try {
      await this.db.add(Tab, tab);
    } catch (e) {
      this.logger.error("Could not add tab to storage", e);
    }
  }

  private async removeTabToStorage(tabType: Type<ITabElement>, id?: number) {
    const index = this.availableTabs.indexOf(tabType);
    const tab = (await this.getSavedTabs()).find(el => (id && el.elId === id && el.tabType == index) || el.tabType === index);
    if (tab)
      await this.db.remove(Tab, tab);
    else this.logger.warn("Could not find tab to remove with", tabType, id);
  }

  /**
   * We remove all doublons if some exists and we returns tabs only for this project
   */
  private async getSavedTabs() {
    return await this.db.getManyWhere(Tab, 'projectId', this.projectId);
  }

  public get tabs(): ITabElement[] {
    return this._tabs.map(el => el[1]) ?? [];
  }
  public get displayedTab(): [number, ITabElement] {
    const index = this._tabs.findIndex(el => el[1].show == true);
    return index > -1 ? [index, this._tabs[index][1]] : null;
  }
  public get hasTabs(): boolean {
    return this._tabs.length > 0;
  }
  public get focusedTabIndex(): number {
    return parseInt(localStorage.getItem("tab-index"));
  }
  public set focusedTabIndex(opt: number) {
    localStorage.setItem("tab-index", opt.toString());
  }
}
