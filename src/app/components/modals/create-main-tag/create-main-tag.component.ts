import { Color } from '@angular-material-components/color-picker';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Tag } from 'src/app/models/api/tag.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { ProjectService } from 'src/app/services/project.service';
import { SnackbarService } from 'src/app/services/ui/snackbar.service';
import { SocketService } from 'src/app/services/sockets/socket.service';

@Component({
  templateUrl: './create-main-tag.component.html',
})
export class CreateMainTagComponent implements OnInit {

  public tag = new Tag("", "");
  public color: Color;
  constructor(
    private readonly project: ProjectService,
    private readonly socket: SocketService,
    private readonly snackbar: SnackbarService,
    private readonly dialogRef: MatDialogRef<CreateMainTagComponent>
  ) { }

  ngOnInit(): void {
  }

  public onTagChange(val: string) {
    this.tag.title = val.replace(" ", "-").toLowerCase();
  }
  public onColorChange(color: Color) {
    this.tag.color = color?.toHexString(false)?.substr(1);
  }

  public addTag() {
    if (this.tag.title?.length == 0) {
      this.snackbar.snack("Impossible d'ajouter un tag vide");
      return;
    } if (this.project.tags.find(el => el.title == this.tag.title)) {
      this.snackbar.snack("Impossible d'ajouter un tag déjà existant");
      return;
    }
    this.project.addProjectTag(this.tag);
    this.socket.socket.emit(Flags.CREATE_TAG, this.tag);
    this.dialogRef.close();
  }

}
