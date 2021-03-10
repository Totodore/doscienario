import { WelcomeTabComponent } from './../components/tabs/welcome-tab/welcome-tab.component';
import { TagsManagerComponent } from './../components/tabs/tags-manager/tags-manager.component';
import { DocumentComponent } from './../components/tabs/document/document.component';
import { ProjectOptionsComponent } from '../components/tabs/project-options/project-options.component';
import { ComponentFactoryResolver, Inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { ITabElement } from '../models/tab-element.model';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  private _tabs: [Type<ITabElement>, ITabElement][] = [];
  private factoryResolver: ComponentFactoryResolver;
  private rootViewContainer: ViewContainerRef;

  private readonly availableTabs: Type<ITabElement>[] = [
    ProjectOptionsComponent,
    DocumentComponent,
    TagsManagerComponent,
    WelcomeTabComponent
  ];

  constructor(@Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver) {
    this.factoryResolver = factoryResolver
  }

  public setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  private addDynamicComponent(el: Type<ITabElement>, id?: number): string | void {
    const factory = this.factoryResolver.resolveComponentFactory(el)
    const component = factory.create(this.rootViewContainer.injector);
    component.instance.show = true;
    this._tabs.push([el, component.instance]);
    this.rootViewContainer.insert(component.hostView);
    if (component.instance?.openTab)
      return component.instance.openTab(id);
  }

  public loadSavedTabs() {
    for (const index of this.savedTabs)
      this.pushTab(this.availableTabs[index[0] || index], false, index[1]);
  }

  /**
   * Take an id, it can be a document id (number)
   * or a tab id
   */
  public pushTab(tab: Type<ITabElement>, save = true, id?: number) {
    for (const tab of this.tabs)
      tab.show = false;
    let displayedIndex: number;
    if ((id && this._tabs.findIndex(el => el[1].docId === id) >= 0)
      || (this._tabs.findIndex(el => el[0].name === tab.name) >= 0 && tab !== DocumentComponent)
    )
      displayedIndex = this._tabs.findIndex(el => el[1].docId === id) || this._tabs.findIndex(el => el[0].name === tab.name);
    console.log(displayedIndex >= 0 ? `Tab already exists : ${displayedIndex}` : `Creating new tab for ${tab.name}`);
    if (displayedIndex >= 0)
      this.showTab(displayedIndex);
    else {
      this.addDynamicComponent(tab, id);
    }
    if (save)
      this.addTabToStorage(tab, id);
  }

  public updateTabStorage(tabId: string, docId: number) {
    const tabs = this.savedTabs;
    tabs.find(el => el[1] === tabId)[1] = docId;
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }
  /**
   * If index is not given, it remove the current tab
   */
  public removeTab(index?: number) {
    index ??= this.displayedTab[0];
    if (this.tabs[index].show)
      (this.tabs[index - 1] ?? this.tabs[this.tabs.length - 1]).show = true;
    this.removeTabToStorage(this._tabs[index][0]);
    this.rootViewContainer.remove(index);
    this._tabs.splice(index, 1);
  }
  public removeDocTab(docId: number) {
    const index = this.tabs.findIndex(el => el.docId === docId);
    console.log(index);
    if (index >= 0)
      this.removeTab(index);
  }
  public showTab(index: number) {
    for (const tab of this.tabs)
      tab.show = false;
    if (this.tabs[index])
      this.tabs[index].show = true;
  }
  public closeAllTab() {
    for (let i = 0; i < this._tabs.length; i++)
      this.removeTab(i);
  }

  private addTabToStorage(tab: Type<ITabElement>, id?: number | string) {
    const index = this.availableTabs.indexOf(tab);
    const tabs = this.savedTabs;
    if (id && index >= 0)
      tabs.push([index, id]);
    else if (index >= 0)
      tabs.push(index);
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }

  private removeTabToStorage(tab: Type<ITabElement>, id?: number) {
    const index = this.availableTabs.indexOf(tab);
    const tabs = this.savedTabs;
    tabs.splice(tabs.indexOf(id ? [index, id] : index), 1);
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }
  private get savedTabs(): (number | [number, number | string])[] {
    return JSON.parse(localStorage.getItem("tabs")) ?? [];
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
}
