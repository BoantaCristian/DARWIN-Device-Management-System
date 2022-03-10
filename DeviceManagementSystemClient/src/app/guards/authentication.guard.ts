import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router) { }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('token') != null){
        if(localStorage.getItem('role') == 'Client')
          this.router.navigateByUrl('')
        if(localStorage.getItem('role') == 'Admin')
          this.router.navigateByUrl('admin')
        return false
      }
      else
        return true;
  }
  
}
