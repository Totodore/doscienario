import { ConfirmComponent } from './../../../utils/confirm/confirm.component';
import { UpdateTagNameReq } from './../../../../models/sockets/tag-sock.model';
import { Flags } from './../../../../models/sockets/flags.enum';
import { SocketService } from './../../../../services/socket.service';
import { SnackbarService } from './../../../../services/snackbar.service';
import { ProjectService } from './../../../../services/project.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Tag, UpdateTagColorReq } from 'src/app/models/sockets/tag-sock.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from '@angular-material-components/color-picker';
import { F } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
})
export class AddTagComponent {

  tagName: string;
  color: Color;

  modify: boolean = false;

  constructor(
    private readonly project: ProjectService,
    private readonly snackbar: SnackbarService,
    private readonly socket: SocketService,
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<AddTagComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly oldTag?: Tag,
  ) {
    if (oldTag) {
      this.modify = true;
      this.tagName = oldTag.name;
      if (oldTag.color) {
        const hex = oldTag.color;
        const [r, g, b] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(el => parseInt(el, 16));
        this.color = new Color(r, g, b);
      }
    }
  }

  public addTag() {
    if (!this.tagName || this.tagName.length == 0 || this.color == null)
      this.snackbar.snack("Tag invalide !");
    else {
      console.log(this.color.toHexString(false));
      const newTag = new Tag(this.tagName, this.color?.toHexString(false).substr(1), this.oldTag?.primary ?? true);
      if (this.modify) {
        this.project.updateProjectTag(this.oldTag, newTag);
        if (newTag.color != this.oldTag.color)
          this.socket.socket.emit(Flags.COLOR_TAG, new UpdateTagColorReq(newTag.name, newTag.color));
        if (newTag.name != this.oldTag.name)
          this.socket.socket.emit(Flags.RENAME_TAG, new UpdateTagNameReq(this.oldTag.name, newTag.name));
      }
      else {
        this.project.addProjectTag(newTag);
        this.socket.socket.emit(Flags.CREATE_TAG, newTag);
      }
      this.dialogRef.close();
    }
  }
  public removeTag() {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer le tag ?" });
    dialog.componentInstance.confirm.subscribe(() => {
      this.socket.socket.emit(Flags.REMOVE_TAG, this.oldTag.name);
      this.project.removeProjectTag(this.oldTag.name);
      dialog.close();
      this.dialogRef.close();
    });

  }
  public onInputChange(val: string) {
    this.tagName = val.replace(" ", "-").toLowerCase();
  }
}
