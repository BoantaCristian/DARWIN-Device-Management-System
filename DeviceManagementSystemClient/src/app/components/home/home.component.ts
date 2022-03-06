import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceManagementService } from 'src/app/services/device-management.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  loggedUser: object = {
    userName: String,
    email: String,
    location: String,
    role: String
  };

  constructor(private router: Router, private service: DeviceManagementService) { }

  ngOnInit() {
    this.getUser()
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    this.router.navigateByUrl('/authentication/login')
  }

  getUser(){
    if(localStorage.getItem('token') != null){
      this.service.getUser().subscribe(
        (res: any) => {
          this.loggedUser = res
          console.log(res)
        },
        err => {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          this.router.navigateByUrl('/authentication/login')
        }
      )
    }
  }

}
