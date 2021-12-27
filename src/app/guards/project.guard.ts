import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProjectGuard implements CanActivate {

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    if (!this.api.inProject) {
      this.router.navigateByUrl("/menu");
      return false;
    }
    return true;
  }

}
