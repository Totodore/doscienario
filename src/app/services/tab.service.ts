import { ComponentFactoryResolver, Inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { ITabElement } from '../models/tab-element.model';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  private _tabs: ITabElement[] = [];
  private factoryResolver: ComponentFactoryResolver;
  private rootViewContainer: ViewContainerRef

  constructor(@Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver) {
    this.factoryResolver = factoryResolver
  }

  public setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  private addDynamicComponent(el: Type<ITabElement>) {
    const factory = this.factoryResolver.resolveComponentFactory(el)
    const component = factory.create(this.rootViewContainer.injector);
    this._tabs.push(component.instance);
    this.rootViewContainer.insert(component.hostView);
  }

  public pushTab(tab: Type<ITabElement>) {
    this.addDynamicComponent(tab);
  }
  public popTab() {
    this.removeTab(this._tabs.length - 1);
  }
  public removeTab(index: number) {
    this.rootViewContainer.remove(index);
    this._tabs.splice(index, 1);
  }

  public get tabs(): ITabElement[] {
    return this._tabs ?? [];
  }
}
