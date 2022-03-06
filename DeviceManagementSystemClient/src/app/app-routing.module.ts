import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { HomeGuard } from './guards/home.guard';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'authentication', component: AuthenticationComponent, canActivate: [AuthenticationGuard], children: [
    {path: 'login', component: LoginComponent}, 
    {path: 'register', component: RegisterComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
