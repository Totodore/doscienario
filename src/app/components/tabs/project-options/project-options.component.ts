import { SnackbarService } from './../../../services/snackbar.service';
import { ApiService } from './../../../services/api.service';
import { ProjectService } from '../../../services/project.service';
import { ITabElement } from '../../../models/tab-element.model';
import { ChangeDetectionStrategy, Component, OnInit, Provider, Type, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styleUrls: ['./project-options.component.scss']
})
export class ProjectOptionsComponent implements ITabElement {

  constructor(
    public readonly project: ProjectService,
  ) { }

  public title: string = "Options";
  public show: boolean = true;

}
