import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    if (!this.api.logged) {
      this.router.navigateByUrl("/auth");
      return false;
    }
    return true;
  }

}
