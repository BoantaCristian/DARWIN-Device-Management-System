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
}
