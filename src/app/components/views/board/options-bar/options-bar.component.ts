import { TabService } from './../../../../services/tab.service';
import { Component, Input, OnInit } from '@angular/core';
import { TabTypes } from 'src/app/models/tab-element.model';

@Component({
  selector: 'app-options-bar',
  templateUrl: './options-bar.component.html',
  styleUrls: ['./options-bar.component.scss']
})
export class OptionsBarComponent {

  constructor(
    private readonly tabs: TabService,
  ) { }

  public get openedTab(): TabTypes | undefined {
    return this.tabs.displayedTab?.[1]?.type;
  }

}
