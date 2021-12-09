import { ColorTagOut } from './../../../models/sockets/out/tag.out';
import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tag } from 'src/app/models/api/tag.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { RenameTagOut } from 'src/app/models/sockets/out/tag.out';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from 'src/app/services/sockets/socket.service';
import { ConfirmComponent } from '../../utils/confirm/confirm.component';

@Component({
  templateUrl: './edit-main-tag.component.html',
})
export class EditMainTagComponent {

  private oldTag: Tag;

  public color: Color;

  constructor(
    @Inject(MAT_DIALOG_DATA) public tag: Tag,
    private readonly dialog: MatDialog,
    private readonly socket: SocketService,
    private readonly project: ProjectService,
    private readonly dialogRef: MatDialogRef<EditMainTagComponent>,
  ) {
    this.oldTag = new Tag(tag.title, tag.color);
    if (tag.color) {
      const hex = tag.color;
      const [r, g, b] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(el => parseInt(el, 16));
      this.color = new Color(r, g, b);
    }
  }

  public removeTag() {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Supprimer le tag ?" });
    dialog.componentInstance.confirm.subscribe(() => {
      this.project.searchComponent.tagSortComponent.unSelectTag(this.tag);
      this.socket.socket.emit(Flags.REMOVE_TAG, this.tag.title);
      this.project.removeProjectTag(this.tag.title);
      dialog.close();
      this.dialogRef.close();
    });
  }

  public onTagChange(val: string) {
    this.tag.title = val.replace(" ", "-").toLowerCase();
  }
  public onColorChange(color: Color) {
    this.tag.color = color?.toHexString(false)?.substr(1);
  }

  public onConfirm() {
    if (this.tag.color != this.oldTag.color)
      this.socket.socket.emit(Flags.COLOR_TAG, new ColorTagOut(this.oldTag.title, this.tag.color));
    if (this.tag.title != this.oldTag.title)
      this.socket.socket.emit(Flags.RENAME_TAG, new RenameTagOut(this.oldTag.title, this.tag.title));
    this.project.updateProjectTag(this.oldTag, this.tag);
    this.dialogRef.close();
  }

}
