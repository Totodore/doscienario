import { Color } from '@angular-material-components/color-picker';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tag } from 'src/app/models/api/tag.model';
import { RenameTagOut } from 'src/app/models/sockets/out/tag.out';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { SnackbarService } from '../../../../services/ui/snackbar.service';
import { Flags } from './../../../../models/sockets/flags.enum';
import { ColorTagOut } from './../../../../models/sockets/out/tag.out';
import { ProjectService } from './../../../../services/project.service';
import { ConfirmComponent } from './../../../utils/confirm/confirm.component';

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
      this.tagName = oldTag.title;
      if (oldTag.color) {
        const hex = oldTag.color;
        const [r, g, b] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(el => parseInt(el, 16));
        this.color = new Color(r, g, b);
      }
    }
  }

  public addTag() {
    if (!this.tagName || this.tagName.length == 0)
      this.snackbar.snack("Tag invalide !");
    else {
      const newTag = new Tag(this.tagName, this.color?.toHexString(false).substring(1));
      if (this.modify) {
        this.project.updateProjectTag(this.oldTag, newTag);
        if (newTag.color != this.oldTag.color)
          this.socket.emit(Flags.COLOR_TAG, new ColorTagOut(newTag.title, newTag.color));
        if (newTag.title != this.oldTag.title)
          this.socket.emit(Flags.RENAME_TAG, new RenameTagOut(this.oldTag.title, newTag.title));
      }
      else {
        this.project.addProjectTag(newTag);
        this.socket.emit(Flags.CREATE_TAG, newTag);
      }
      this.dialogRef.close();
    }
  }
  public removeTag() {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer le tag ?" });
    dialog.componentInstance.confirm.subscribe(() => {
      this.socket.emit(Flags.REMOVE_TAG, this.oldTag.title);
      this.project.removeProjectTag(this.oldTag.title);
      dialog.close();
      this.dialogRef.close();
    });

  }
  public onInputChange(val: string) {
    this.tagName = val.replace(" ", "-").toLowerCase();
  }
}
