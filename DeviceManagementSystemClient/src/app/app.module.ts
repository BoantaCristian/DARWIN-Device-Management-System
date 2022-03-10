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
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DeviceDetailsComponent } from './dialogs/device-details/device-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    AuthenticationComponent,
    DeviceDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    FormsModule, ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule, MatTooltipModule, MatDialogModule, MatListModule
  ],
  entryComponents: [DeviceDetailsComponent],
  providers: [DeviceManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
