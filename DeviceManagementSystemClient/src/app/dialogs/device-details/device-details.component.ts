import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DeviceManagementService } from 'src/app/services/device-management.service';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {
  device: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: DeviceManagementService) { }

  ngOnInit() {
    this.getDeviceDetails()
  }

  getDeviceDetails(){
    this.service.getDeviceDetails(this.data).subscribe(
      res => {
        this.device = res
      },
      err => {
        console.log(err)
      }
    )
  }

}
