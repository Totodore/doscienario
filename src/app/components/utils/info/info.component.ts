import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
})
export class InfoComponent {

  public text: string;
  public content: string;
  public closable = true;

  constructor(@Inject(MAT_DIALOG_DATA) data: { text: string, content: string, closable: boolean }) {
    this.text = data.text;
    this.content = data.content;
    this.closable = data.closable;
  }
}
