import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceManagementService {

  URL = 'http://localhost:50623/api'
  constructor(private http: HttpClient) { }
  register(body){
    return this.http.post(`${this.URL}/User/Register`, body)
  }
  login(body){
    return this.http.post(`${this.URL}/User/Login`, body)
  }
  getUser(){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.get(`${this.URL}/User/GetUser`, {headers: token})
  }
  getDevices(){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.get(`${this.URL}/DeviceManagement/GetDevicesWithUsers`, {headers: token})
  }
  getLoggedUserDevice(userName){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.get(`${this.URL}/DeviceManagement/GetLoggedUserDevice/${userName}`, {headers: token})
  }
  getDeviceDetails(deviceId){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.get(`${this.URL}/DeviceManagement/GetDeviceDetails/${deviceId}`, {headers: token})
  }
  assignDevice(idDevice, userName){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.get(`${this.URL}/DeviceManagement/AssignDevice/${idDevice}/${userName}`, {headers: token})
  }
  changeDevice(idDevice, userName){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.get(`${this.URL}/DeviceManagement/ChangeDevice/${idDevice}/${userName}`, {headers: token})
  }
  deleteDevice(idDevice){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.delete(`${this.URL}/DeviceManagement/DeleteDevice/${idDevice}`, {headers: token})
  }
  removeDevice(idDevice){
    var token = new HttpHeaders({'Authorization': 'Bearer '+ localStorage.getItem('token')})
    return this.http.delete(`${this.URL}/DeviceManagement/RemoveDevice/${idDevice}`, {headers: token})
  }
}
