import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('token') != null){
        if(localStorage.getItem('role') != 'Admin'){
          this.router.navigateByUrl('')
          return false
        }
        if(localStorage.getItem('role') == 'Admin')
          return true
      }
      else{
        this.router.navigateByUrl('/authentication/login')
        return false;
      }
  }
  
}
