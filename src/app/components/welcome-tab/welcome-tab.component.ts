import { ITabElement } from './../../models/tab-element.model';
import { ProjectService } from './../../services/project.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-tab',
  templateUrl: './welcome-tab.component.html',
  styleUrls: ['./welcome-tab.component.scss']
})
export class WelcomeTabComponent {

  constructor(
    public readonly project: ProjectService
  ) { }
}
