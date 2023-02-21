import { Tab } from './../models/sys/tab.model';
import { DbService } from './database/db.service';

import { BlueprintComponent } from './../components/tabs/blueprint/blueprint.component';
import { WelcomeTabComponent } from './../components/tabs/welcome-tab/welcome-tab.component';
import { DocumentComponent } from './../components/tabs/document/document.component';
import { ProjectOptionsComponent } from '../components/tabs/project-options/project-options.component';
import { ComponentFactoryResolver, Inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ITabElement, TabTypes } from '../models/sys/tab.model';
import { KeyStore } from '../models/sys/keystore.model';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  private _tabs: Map<string, ITabElement> = new Map();
  private rootViewContainer: ViewContainerRef;
  private projectId: number;
  private _displayedTabId: string | undefined;

  private readonly availableTabs: Type<ITabElement>[] = [
    ProjectOptionsComponent,
    DocumentComponent,
    BlueprintComponent,
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

  /**
   * Add a new tab to the tab list
   * @param el The tab component to add
   * @param id An element id for the tab
   * @param tabId An existing tab id to sync comming from the db
   * @returns a tab uuid
   */
  private addDynamicComponent(el: Type<ITabElement>, id?: number, tabId?: string, show = true): string {
    const factory = this.factoryResolver.resolveComponentFactory(el);
    const component = factory.create(this.rootViewContainer.injector);
    tabId ??= component.instance.generateUid();

    if (this._tabs.has(tabId)) {
      this.logger.warn("Trying to add a tab with an already existing id :", tabId);
    }
    this._tabs.set(tabId, component.instance);
    this.rootViewContainer.insert(component.hostView);
    component.instance.show = show;
    component.instance.openTab?.(tabId, id);
    this.displayedTabId = tabId;
    return tabId;
  }

  /**
   * Load the saved tabs from the database
   */
  public async loadSavedTabs(projectId: number) {
    this.projectId = projectId;
    const savedTabs = await this.getSavedTabs();
    this.logger.log("Starting to load", savedTabs.length, "saved tabs");
    for (const tab of savedTabs) {
      const element = this.availableTabs[tab.tabType];
      this.addDynamicComponent(element, tab.elId, tab.id, false);
      this.logger.log("Loading saved tab :", this.availableTabs[tab.tabType].name);
    }
    this.logger.log("Finished loading saved tabs");
    const previousTabId = (await this.db.getOne(KeyStore, "tab-index-" + this.projectId))?.value;
    if (this._tabs.has(previousTabId)) {
      this.logger.log("Previous tab found :", previousTabId);
      this.showTab(previousTabId);
    }
  }


  /**
   * Create a new tab and push it to the view. If the tab already exists, it will be displayed
   * @param tab The tab component to add or a tab object
   * @param save If the tab should be saved in the database
   * @param id An optional element id for the tab
   * @returns The tab uuid
   */
  public async pushTab(tab: Type<ITabElement>, save = true, id?: number): Promise<string> {
    if (this.focusedTab)
      this.focusedTab.show = false;
    let tabId: string | undefined;
    for (const [uid, tabEl] of this._tabs.entries()) {
      if (
        (tabEl.type !== TabTypes.STANDALONE && id && tabEl.id === id) ||
        (tabEl.type === TabTypes.STANDALONE && tab.name === tabEl.constructor.name))
        tabId = uid;
    }
    this.logger.log(tabId ? `Tab already exists : ${tabId}` : `Creating new tab for ${tab.name}`);
    if (tabId)
      return this.showTab(tabId);
    else {
      const tabId = this.addDynamicComponent(tab, id);
      if (save)
        await this.addTabToStorage(tab, tabId, id);
      return tabId;
    }
  }

  /**
   * If index is not given, it removes the current tab
   */
  public removeTab(tabId = this.displayedTabId, storage = true) {
    if (!this._tabs.has(tabId)) {
      this.logger.warn("Trying to remove a tab that doesn't exist :", tabId);
      return;
    }
    this.logger.log("Removing tab :", tabId);
    const tab = this._tabs.get(tabId);
    const tabIndex = this.getTabIndex(tabId);
    tab.onClose?.();
    if (tab.show && this.tabs.length > 1) {
      (this.tabs[tabIndex - 1] ?? this.tabs[tabIndex + 1]).show = true;
      (this.tabs[tabIndex - 1] ?? this.tabs[tabIndex + 1]).onFocus?.();
    }
    if (storage)
      this.removeTabToStorage(tabId);
    this.rootViewContainer.remove(tabIndex);
    this._tabs.delete(tabId);
  }

  /**
   * Show a tab by its index or tabId
   * @param index the index or tabId of the tab to show
   * @param save if set to true the tab index is saved
   * @returns return the new tab uuid
   */
  public showTab(tabId: string, save = true) {
    const displayedTab = this._tabs.get(this.displayedTabId);
    const newTab = this._tabs.get(tabId);
    if (!newTab) {
      this.logger.warn("Trying to show a tab that doesn't exist :", tabId);
      return;
    }
    if (displayedTab) {
      displayedTab.onUnFocus?.();
      displayedTab.show = false;
    }
    newTab.show = true;
    newTab.onFocus?.();
    if (save)
      this.displayedTabId = newTab.tabId;
    return newTab.tabId;
  }


  /**
   * Show the next tab after the current one
   */
  public showNextTab() {
    if (this.tabs.length <= 1)
      return;
    const index = this.getTabIndex(this.displayedTabId) + 1;
    return this.showTab(this.tabs[index >= this.tabs.length ? 0 : index].tabId);
  }

  /**
   * Close all tabs and remove them from storage if needed
   * @param removeFromStorage Specify if the tabs should be removed from storage
   */
  public async closeAllTab(removeFromStorage = false) {
    const tabLength = this._tabs.size;
    for (let i = 0; i < tabLength; i++)
      this.removeTab(this._tabs[0]);
    if (removeFromStorage) {
      await this.db.removeMany(Tab, await this.getSavedTabs());
    }
    localStorage.removeItem("tab-index");
  }

  /**
   * Get a tab component from its element id and type
   * @param tabType The type of the tab
   * @param id the element id of the tab
   */
  public getTab<T extends ITabElement>(tabType: TabTypes, id: number): T {
    return this.tabs.find(el => el.type == tabType && el.id === id) as T;
  }

  /**
   * Get a tab component from its tabId uuid
   * @param tabId the tab uuid to get
   */
  public getTabFromId<T extends ITabElement>(tabId: string): T {
    return this._tabs.get(tabId) as T;
  }

  public async isTabSaved(tabId: string) {
    return !!await this.db.getOne(Tab, tabId);
  }

  /**
   * Add a tab to the storage
   * If the tab already exists in storage it will not be added
   * @param type the type of the tab
   * @param id the optional element id of the tab
   */
  private async addTabToStorage(type: Type<ITabElement>, tabId: string, id?: number) {
    const index = this.availableTabs.indexOf(type);
    const tab = new Tab(this.projectId, index, tabId, id);
    const savedTabs = await this.getSavedTabs();
    if (savedTabs.find(el => el.id === tab.id && el.projectId === this.projectId)) {
      this.logger.warn("Tab already exists");
      return;
    }
    try {
      await this.db.add(Tab, tab);
    } catch (e) {
      this.logger.error("Could not add tab to storage", e);
    }
  }

  /**
   * Remove a tab from the storage
   * @param tabType the type of the tab
   * @param id the optional element id of the tab
   */
  private async removeTabToStorage(tabId: string) {
    const tab = await this.db.getOne(Tab, tabId);
    if (tab)
      await this.db.remove(Tab, tab);
    else
      this.logger.warn("Could not find tab to remove:", tabId);
  }

  private async getSavedTabs() {
    return await this.db.getManyWhere(Tab, 'projectId', this.projectId);
  }
  public getTabIndex(tabId: string) {
    return this.tabs.findIndex(el => el.tabId === tabId);
  }
  public get tabs(): ITabElement[] {
    return [...this._tabs.values()] ?? [];
  }
  public get focusedTab(): ITabElement {
    return this._tabs.get(this.displayedTabId);
  }
  public get hasTabs(): boolean {
    return this._tabs.size > 0;
  }
  public get displayedTabId(): string {
    return this._displayedTabId;
  }
  public set displayedTabId(tabId: string | null) {
    this._displayedTabId = tabId;
    if (tabId) {
      this.db.upsert(KeyStore, { key: "tab-index-" + this.projectId, value: tabId }, "tab-index-" + this.projectId)
        .catch(e => this.logger.error("Could not save tab index", e));
    } else {
      this.db.remove(KeyStore, "tab-index-" + this.projectId)
        .catch(e => this.logger.error("Could not remove tab index", e));
    }
  }
}
