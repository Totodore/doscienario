import { ProgressService } from '../../../services/progress.service';
import { ConfirmPasswordComponent } from '../../utils/confirm-password/confirm-password.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public password: string;
  public name: string;

  constructor(
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly progress: ProgressService
  ) { }

  ngOnInit(): void {
    if (this.api.logged)
      this.router.navigateByUrl("/");
  }

  public async submit(form: HTMLFormElement) {
    if (!this.checkForm(form))
      return;
    this.progress.show();
    const res = await this.api.login({ name: this.name, password: this.password });
    this.progress.hide();
    if (res) {
      this.router.navigateByUrl("/menu");
      this.snackbar.snack(`Bienvenu ${this.name} !`);
    }
    else {
      this.password = "";
      this.snackbar.snack("Erreur lors de la connexion", 0);
    }
  }

  public register(form: HTMLFormElement) {
    if (!this.checkForm(form))
      return;
    const dialog = this.dialog.open(ConfirmPasswordComponent);
    dialog.componentInstance.onConfirm.subscribe(async (pass: string) => {
      dialog.close();
      if (pass === this.password) {
        this.progress.show();
        const res = await this.api.register({ name: this.name, password: this.password });
        this.progress.hide();
        if (res) {
          this.router.navigateByUrl("/menu");
          this.snackbar.snack(`Bienvenu ${this.name} !`);
        } else
          this.snackbar.snack("Erreur lors de l'inscription !");
      } else
        this.snackbar.snack("Les mots de passe ne concordent pas !");
    });
  }

  private checkForm(form: HTMLFormElement) {
    return form.checkValidity() && this.name?.length > 0 && this.password?.length > 0;
  }

}
