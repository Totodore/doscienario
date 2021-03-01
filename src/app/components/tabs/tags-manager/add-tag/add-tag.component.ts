import { SnackbarService } from './../../../../services/snackbar.service';
import { ProjectService } from './../../../../services/project.service';
import { Component, OnInit } from '@angular/core';
import { Tag } from 'src/app/models/sockets/tag-sock.model';
import { MatDialogRef } from '@angular/material/dialog';
import { Color } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
})
export class AddTagComponent {

  tagName: string;
  color: Color;

  constructor(
    private readonly project: ProjectService,
    private readonly snackbar: SnackbarService,
    private dialogRef: MatDialogRef<AddTagComponent>
  ) { }

  public addTag() {
    if (this.tagName?.length == 0 || this.color == null)
      this.snackbar.snack("Tag invalide !");
    else {
      this.project.tags.push(new Tag(this.tagName, this.color?.toHexString(false)));
      this.dialogRef.close();
    }
  }
  public onInputChange(val: string) {
    this.tagName = val.replace(" ", "-");
  }
}
