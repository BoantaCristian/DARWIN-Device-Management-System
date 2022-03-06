import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceManagementService } from 'src/app/services/device-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private service: DeviceManagementService,  private toastr: ToastrService) { }

  registerForm = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Location: ['', Validators.required],
    Password: ['', [Validators.required, Validators.minLength(4)]],
    ConfirmPassword: ['', Validators.required]
  })

  mismatch = false
  hide = true;
  
  ngOnInit() {
  }
  
  comparePasswords(){
    if(this.registerForm.value.Password != this.registerForm.value.ConfirmPassword){
      this.mismatch = true
    }
    else{
      this.mismatch = false
    }
  }

  register(){
    var body = {
      UserName: this.registerForm.value.UserName,
      Email: this.registerForm.value.Email,
      Location: this.registerForm.value.Location,
      Password: this.registerForm.value.Password,
      Role: 'Client'
    }
    
    this.service.register(body).subscribe(
      (res:any) => {
        console.log(res)
        if(res.succeeded){
          this.toastr.success(`User ${body.UserName} created`,'Success!')
          this.registerForm.reset()
        }
        else {
          res.errors.forEach(element => {
            console.log(element)
            if(element.code == 'DuplicateUserName')
              this.toastr.error('Username already taken', 'Register Failed!')
            else{
              console.log(element.description)
              this.toastr.error(`${element.description}`, 'Register Failed!')
            }
          });
        }
      },
      err => {
        this.toastr.error(`${err.error.message}`, 'Register Failed!')
        console.log(err)
      }
    )
  }

}
