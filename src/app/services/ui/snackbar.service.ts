import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
		private readonly _snackBar: MatSnackBar,
  ) { }

  public async snack(content: string, duration: number = 3500) {
    await lastValueFrom(this._snackBar.open(content, null, { duration: duration == 0 ? null : duration }).afterDismissed());
  }
}
