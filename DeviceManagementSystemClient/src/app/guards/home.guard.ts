import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('token') == null){
        localStorage.removeItem('role')
        this.router.navigateByUrl('authentication/login')
        return false
      }
      else if(localStorage.getItem('token') != null && localStorage.getItem('role') == 'Admin'){
        this.router.navigateByUrl('admin')
        return false
      }
      else
        return true;
  }
  
}
