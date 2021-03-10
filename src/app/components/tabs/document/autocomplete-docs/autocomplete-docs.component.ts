import { ProjectService } from 'src/app/services/project.service';
import { GetProjectDocumentRes } from './../../../../models/api/project.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-autocomplete-docs',
  templateUrl: './autocomplete-docs.component.html',
  styleUrls: ['./autocomplete-docs.component.scss']
})
export class AutocompleteDocsComponent {

  @Input() query: string;

  constructor(
    private readonly project: ProjectService
  ) {}

  get results(): GetProjectDocumentRes[] {
    return this.project.docs.filter(el => el.title.toLowerCase().startsWith(this.query.toLowerCase()));
  }
}
