import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, Sort, MatSort, MatPaginator, MatDialog} from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { DeviceDetailsComponent } from 'src/app/dialogs/device-details/device-details.component';
import { Device } from 'src/app/Models/Device';
import { FreeUser } from 'src/app/Models/FreeUser';
import { User } from 'src/app/Models/User';
import { DeviceManagementService } from 'src/app/services/device-management.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  
  users: MatTableDataSource<User>;
  deviceList: MatTableDataSource<Device>;
  freeUsers:  FreeUser[] = [];
  userColumns: string[] = ['userName', 'email', 'location', 'role', 'actions'];
  deviceColumns: string[] = ["device", "user", "userEmail", "deviceActions"]
  addUserForm = this.formBuider.group({
    UserName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Role: ['', Validators.required],
    Location: '',
    Password: ['', [Validators.required, Validators.minLength(4)]],
    ConfirmPassword: ['', Validators.required] 
  })
  deviceForm = this.formBuider.group({
    Name: ['', Validators.required],
    Manufacturer: ['', Validators.required],
    Type: ['', Validators.required],
    OperatingSystem: ['', Validators.required],
    Processor: ['', Validators.required],
    RamAmount: [null, Validators.required] 
  })
  roles: string[] = ["Admin", "Client"]
  deviceTypes: string[] = ["Smartphone", "Tablet"]
  displayLocation: boolean = false;
  mismatch: boolean = false
  hide: boolean = true;
  changeDeviceFromControl = new FormControl();
  assignUserFromControl = new FormControl();
  availableDeviceStatus: string = "Change device"
  availableUserStatus: string = "Assign user";
  updateMode: boolean = false;
  deviceToUpdate: any;
  filteredDevices: any;
  filteredUsers: any;
  searchUserKey: string;
  searchDeviceKey: string;

  constructor(private formBuider: FormBuilder, private router: Router, private service: DeviceManagementService, private toastr: ToastrService, private dialog: MatDialog) { }

  @ViewChild(MatSort, {static: false}) sort: MatSort
  @ViewChild('usersPaginator', {read: MatPaginator, static: false}) usersPaginator: MatPaginator;
  @ViewChild('devicesPaginator', {read: MatPaginator, static: false}) devicesPaginator: MatPaginator;

  ngOnInit() {
    this.getDevices()
    this.getUsers()
    this.getFreeUsers()
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    this.router.navigateByUrl('/authentication/login')
  }

  getUsers(){
    this.service.getUsers().subscribe(
      (res: any) => {
        this.users = new MatTableDataSource(res)
        setTimeout(()=> this.fetchDataTable(), 200)
        setTimeout(()=> this.fetchDevicesForAutocomplete(), 200)
      }
    )
  }

  getFreeUsers(){
    this.service.getFreeUsers().subscribe(
      (res: any) => {
        this.freeUsers = res
        
        setTimeout(()=> this.fetchFreeUsersForAutocomplete(), 200)
        let availableUsers = false
        res.forEach(user => {
          if(user.deviceName == 'No device'){
            availableUsers = true
            return
          }
        });
        if(!availableUsers){
          this.availableUserStatus = 'No free users'
          this.assignUserFromControl.disable();
        }
        else{
          this.availableUserStatus = 'Assign user'
          this.assignUserFromControl.enable();
        }
      }
    )
  }

  addUser(){
    let body: User = {
      UserName:  this.addUserForm.value.UserName,
      Email:  this.addUserForm.value.Email,
      Password:  this.addUserForm.value.Password,
      Location:  this.addUserForm.value.Location,
      Role:  this.addUserForm.value.Role,
    }
    this.service.register(body).subscribe(
      (res:any) => {
        if(res.succeeded){
          this.toastr.success(`User ${body.UserName} created`,'Success!')
          this.addUserForm.reset()
          this.getUsers()
          this.handleUserDeviceAssignmentUpdates()
        }
        else {
          res.errors.forEach(element => {
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

  deleteUser(userName){
    this.service.deleteUser(userName).subscribe(
      res => {
        this.toastr.success(`User ${userName} deleted`, 'Success!')
        this.getUsers()
        this.handleUserDeviceAssignmentUpdates()
      },
      err => {
        this.toastr.error(`${err.error.message}`, 'Failed!')
      }
    )
  }

  selectRole(role){
    if(role == 'Admin'){
      this.displayLocation = false
      this.addUserForm.setValue({
        UserName: this.addUserForm.value.UserName,
        Email: this.addUserForm.value.Email,
        Role: this.addUserForm.value.Role,
        Location: '',
        Password: this.addUserForm.value.Password,
        ConfirmPassword: this.addUserForm.value.ConfirmPassword,
      });
    }
    else
      this.displayLocation = true
  }

  comparePasswords(){
    if(this.addUserForm.value.Password != this.addUserForm.value.ConfirmPassword){
      this.mismatch = true
    }
    else{
      this.mismatch = false
    }
  }

  getDevices(){
    this.service.getDevices().subscribe(
      (res: any) => {
        this.deviceList = new MatTableDataSource(res)

        this.fetchDevicesForAutocomplete()
        let availableDevice = false
        res.forEach(element => {
            
          if(element.userName == null){
            availableDevice = true
            return
          }
        });
        if(!availableDevice){
          this.changeDeviceFromControl.disable();
          this.availableDeviceStatus = "No device available"
        }
        else{
          this.availableDeviceStatus = "Change device"
          this.changeDeviceFromControl.enable();
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  getDeviceDetails(deviceId){
    this.service.getDeviceDetails(deviceId).subscribe(
      res => {
        this.deviceToUpdate = res
      },
      err => {
        console.log(err)
      }
    )
  }

  addDevice(){
    this.service.addDevice(this.deviceForm.value).subscribe(
      res => {
        this.toastr.success(`Device ${this.deviceForm.value.Name} added`, 'Success!')
        this.deviceForm.reset()
        this.getDevices()
        setTimeout(() => {this.fetchDataTable()}, 200);
      },
      err => {
        this.toastr.error(err.error.message, 'Falied')
        console.log(err)
      }
    )
  }

  updateDevice(){
    this.service.updateDevice(this.deviceToUpdate.id, this.deviceForm.value).subscribe(
      res => {
        this.toastr.success(`${this.deviceToUpdate.name} updated`, 'Success!')
        this.deviceForm.reset()
        this.deviceToUpdate = null
        this.updateMode = false
        this.fetchDataTable()
      },
      err => {
        console.log(err)
        this.toastr.error(`${err.error.message}` ,'Failed!')
      }
    )
  }

  changeDevice(deviceId, userName){
    this.service.changeDevice(deviceId, userName).subscribe(
      (res: any) => {
        this.toastr.success(`Device ${res.name} assigned`, 'Success!')
        this.handleUserDeviceAssignmentUpdates()
      }
    )
  }

  assignUser(deviceId, userName){
    this.service.assignDevice(deviceId, userName).subscribe(
      (res: any) => {
        this.toastr.success(`Decive assigned to ${res.userName}`, 'Success!')
        this.handleUserDeviceAssignmentUpdates()
      },
      err => {
        console.log(err)
      }
    )
  }

  removeDevice(deviceId, event){
    event.stopPropagation()
    this.service.removeDevice(deviceId).subscribe(
      (res: any) => {
        this.toastr.success(`Device ${res.name} removed`, 'Success!')
        this.handleUserDeviceAssignmentUpdates()
      },
      err => {
        console.log(err)
        this.toastr.error(`${err.error.message}`,'Failed!')
      }
    )
  }

  deleteDevice(deviceId, event){
    event.stopPropagation()
    this.service.deleteDevice(deviceId).subscribe(
      (res: any) => {
        this.toastr.success(`Device ${res.name} deleted`, 'Success!')
        this.handleUserDeviceAssignmentUpdates()
      },
      err => {
        this.toastr.error(err.error.message, 'Falied')
        console.log(err)
      }
    )
  }

  fetchDevice(deviceId, event){
    event.stopPropagation()
    this.getDeviceDetails(deviceId)
    setTimeout(() => { this.populateForm(this.deviceToUpdate) }, 200);
  }
  
  cancelUpdate(event){
    event.stopPropagation()
    this.deviceForm.reset()
    this.deviceToUpdate = null
    this.updateMode = false
  }

  openDeviceDetailsDialog(deviceId){
    var deviceDetailsDialog = this.dialog.open(DeviceDetailsComponent, {data: deviceId})
    deviceDetailsDialog.afterClosed().subscribe( () =>{ })
  }

  populateForm(device){
    this.updateMode = true
    this.deviceForm.setValue({
      Name: device.name,
      Manufacturer: device.manufacturer,
      Type: device.type,
      OperatingSystem: device.operatingSystem,
      Processor: device.processor,
      RamAmount: device.ramAmmount
    })
  }

  fetchDataTable(){
    this.users.sort = this.sort
    this.users.paginator = this.usersPaginator
    this.deviceList.paginator = this.devicesPaginator
  }

  private _filterDevices(value: any): any[] {
    const filterValue = (value || '').toLowerCase();
    return this.deviceList.filteredData.filter(device => device.deviceName.toLowerCase().includes(filterValue));
  }
  private _filterUsers(value: any): any[] {
    const filterValue = (value || '').toLowerCase();
    return this.freeUsers.filter(user => user.userName.toLowerCase().includes(filterValue));
  }

  fetchDevicesForAutocomplete(){
    this.filteredDevices = this.changeDeviceFromControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDevices(value))
    );
  }

  fetchFreeUsersForAutocomplete(){
    this.filteredUsers = this.assignUserFromControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value))
    );
  }

  handleUserDeviceAssignmentUpdates(){
    this.getDevices()
    this.getFreeUsers()
    setTimeout(() => {this.fetchDataTable()}, 200);
    setTimeout(() => {this.fetchDevicesForAutocomplete()}, 300);
    setTimeout(() => {this.fetchFreeUsersForAutocomplete()}, 300);
    this.changeDeviceFromControl.reset()
    this.assignUserFromControl.reset()
  }

  checkAvailability(event){
    event.stopPropagation()
    if(this.availableDeviceStatus == "No device available" && this.availableUserStatus != "No free users")
      this.toastr.warning('No free devices', 'Warning!')
    if(this.availableUserStatus == "No free users" && this.availableDeviceStatus != "No device available")
      this.toastr.warning('No free users', 'Warning!')
    if(this.availableUserStatus == "No free users" && this.availableDeviceStatus == "No device available")
      this.toastr.warning('No free devices and users', 'Warning!')
  }

  stopPropagation(event){
    event.stopPropagation();
  }

  onSearchClear(){
    this.searchUserKey = ""
    this.searchDeviceKey = ""
    this.search('users')
    this.search('devices')
  }

  search(option){
      switch (option) {
        case 'users':
          this.users.filter = this.searchUserKey.trim().toLocaleLowerCase()
          break;
        case 'devices':
          this.deviceList.filter = this.searchDeviceKey.trim().toLocaleLowerCase()
          break;
        default:
          break;
      }
  }

}
