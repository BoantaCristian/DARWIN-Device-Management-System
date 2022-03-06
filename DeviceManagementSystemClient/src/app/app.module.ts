import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { AdminComponent } from './components/admin/admin.component';

import { DeviceManagementService } from "./services/device-management.service";
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    FormsModule, ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatCardModule, MatButtonModule, MatInputModule, MatIconModule
  ],
  providers: [DeviceManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
