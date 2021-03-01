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
    TagsManagerComponent
  ];

  constructor(@Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver) {
    this.factoryResolver = factoryResolver
  }

  public setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  private addDynamicComponent(el: Type<ITabElement>) {
    const factory = this.factoryResolver.resolveComponentFactory(el)
    const component = factory.create(this.rootViewContainer.injector);
    this._tabs.push([el, component.instance]);
    this.rootViewContainer.insert(component.hostView);
  }

  public loadSavedTabs() {
    for (const index of this.savedTabs)
      this.pushTab(this.availableTabs[index], false);
  }

  public pushTab(tab: Type<ITabElement>, save = true) {
    for (const tab of this.tabs)
      tab.show = false;
    this.addDynamicComponent(tab);
    if (save)
      this.addTabToStorage(tab);
    }
  public removeTab(index: number) {
    this.removeTabToStorage(this._tabs[index][0]);
    this.rootViewContainer.remove(index);
    this._tabs.splice(index, 1);
  }
  public showTab(index: number) {
    for (const tab of this.tabs)
      tab.show = false;
    this.tabs[index].show = true;
  }
  public renameTab(index: number) {
    this._tabs[index][1]?.onRename();
  }

  private addTabToStorage(tab: Type<ITabElement>) {
    const index = this.availableTabs.indexOf(tab);
    const tabs = this.savedTabs;
    tabs.push(index);
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }

  private removeTabToStorage(tab: Type<ITabElement>) {
    const index = this.availableTabs.indexOf(tab);
    const tabs = this.savedTabs;
    console.log(tabs);
    tabs.splice(tabs.indexOf(index), 1);
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }
  private get savedTabs(): number[] {
    return JSON.parse(localStorage.getItem("tabs")) ?? [];
  }

  public get tabs(): ITabElement[] {
    return this._tabs.map(el => el[1]) ?? [];
  }
  public get displayedTab(): [number, ITabElement] {
    const index = this._tabs.findIndex(el => el[1].show == true);
    return index > -1 ? [index, this._tabs[index][1]] : null;
  }
}
