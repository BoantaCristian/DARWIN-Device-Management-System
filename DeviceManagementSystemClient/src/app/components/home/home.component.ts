import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Sort, MatSort, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DeviceManagementService } from 'src/app/services/device-management.service';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { DeviceDetailsComponent } from 'src/app/dialogs/device-details/device-details.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  loggedUser: any = {
    userName: String,
    email: String,
    location: String,
    role: String
  };
  deviceList: any = [];
  loggedUserDevice = new MatTableDataSource();
  displayDeviceColumns: string[] = ["device", "user", "email", "actions"]
  availableDeviceStatus: string = "No device available"
  manageDeviceFromControl = new FormControl();
  filteredOptions: Observable<any[]>;
  searchKey: string;

  constructor(private router: Router, private service: DeviceManagementService, private toastr: ToastrService, private dialog: MatDialog) { }

  @ViewChild(MatSort, {static: false}) sort: MatSort
  @ViewChild('devicesPaginator', {read: MatPaginator, static: false}) devicesPaginator: MatPaginator;  

  ngOnInit() {
    this.getUser()
    this.getDevices()
    setTimeout(()=> this.fetchDevicesForAutocomplete(), 200)
    setTimeout(()=> this.fetchDataTable(), 200)
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
          if(res.role  != 'Admin')
            this.getLoggedUserDevice(res.userName)
        },
        err => {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          this.router.navigateByUrl('/authentication/login')
        }
      )
    }
  }

  getDevices(){
    this.service.getDevices().subscribe(
      (res: any) => {
        this.deviceList = new MatTableDataSource(res)
        
        let availableDevice = false
        res.forEach(element => {
          if(element.userName == null){
            availableDevice = true
            return
          }
        });
        if(availableDevice){
          this.manageDeviceFromControl.enable();
          this.availableDeviceStatus = "Change device"
        }
        else
          this.manageDeviceFromControl.disable();
      },
      err => {
        console.log(err)
      }
    )
  }

  getLoggedUserDevice(userName){
    this.service.getLoggedUserDevice(userName).subscribe(
      (res: any) => {
        this.loggedUserDevice = new  MatTableDataSource(res)
      }
    )
  }

  deleteDevice(deviceId){
    this.service.deleteDevice(deviceId).subscribe(
      (res: any) => {
        this.toastr.success(`Device ${res.name} deleted`, 'Success!')
        this.getDevices()
        setTimeout(()=> this.fetchDevicesForAutocomplete(), 200)
        setTimeout(()=> this.fetchDataTable(), 200)
      },
      err => {
        console.log(err)
        this.toastr.error(`${err.error.message}`,'Failed!')
      }
    )
  }
  removeDevice(deviceId, event){
    event.stopPropagation()
    this.service.removeDevice(deviceId).subscribe(
      (res: any) => {
        this.toastr.success(`Device ${res.name} removed`, 'Success!')
        this.handleDeviceAssignmentUpdates()
      },
      err => {
        console.log(err)
        this.toastr.error(`${err.error.message}`,'Failed!')
      }
    )
  }

  assignDevice(deviceId){
    this.service.assignDevice(deviceId, this.loggedUser.userName).subscribe(
      (res: any) => {
        this.toastr.success(`Device ${res.name} assigned`, 'Success!')
        this.handleDeviceAssignmentUpdates()
      },
      err => {
        console.log(err)
      }
    )
  }

  changeDevice(deviceId){
    this.service.changeDevice(deviceId, this.loggedUser.userName).subscribe(
      (res: any) => {
        this.toastr.success(`Device ${res.name} assigned`, 'Success!')
        this.handleDeviceAssignmentUpdates()
      }
    )
  }

  checkAvailability(event){
    event.stopPropagation()
    if(this.availableDeviceStatus == "No device available")
      this.toastr.warning('No free devices', 'Warning!')
  }

  openDeviceDetailsDialog(deviceId){
    var deviceDetailsDialog = this.dialog.open(DeviceDetailsComponent, {data: deviceId})
    deviceDetailsDialog.afterClosed().subscribe( () =>{ })
  }

  stopPropagation(event){
    event.stopPropagation();
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.deviceList.filteredData.filter(device => device.deviceName.toLowerCase().includes(filterValue));
  }

  fetchDevicesForAutocomplete(){
    this.filteredOptions = this.manageDeviceFromControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  fetchDataTable(){
    this.deviceList.sort = this.sort
    this.deviceList.paginator = this.devicesPaginator
  }

  handleDeviceAssignmentUpdates(){
    setTimeout(() => {this.getLoggedUserDevice(this.loggedUser.userName)}, 200);
    setTimeout(() => {this.getDevices()}, 200);
    setTimeout(()=> this.fetchDevicesForAutocomplete(), 400)
    setTimeout(()=> this.fetchDataTable(), 300)
    setTimeout(()=> this.manageDeviceFromControl.reset(), 300)
  }

  onSearchClear(){
    this.searchKey = ""
    this.search()
  }

  search(){
        this.deviceList.filter = this.searchKey.trim().toLocaleLowerCase()
  }

}
