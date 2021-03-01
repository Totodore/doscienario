import { AddTagComponent } from './add-tag/add-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './../../../services/project.service';
import { ITabElement } from './../../../models/tab-element.model';
import { ChangeDetectionStrategy, Component, OnInit, Provider, Type, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tags-manager',
  templateUrl: './tags-manager.component.html',
  styleUrls: ['./tags-manager.component.scss']
})
export class TagsManagerComponent implements OnInit, ITabElement {

  constructor(
    public readonly project: ProjectService,
    public readonly dialog: MatDialog
  ) { }
  title: string = "Gestionnaire de tags";
  show: boolean = false;

  ngOnInit(): void {
  }

  public addPrimaryTag() {
    this.dialog.open(AddTagComponent);
  }

  get primaryTags() {
    return this.project.tags.filter(el => el.primary);
  }
}
