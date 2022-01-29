import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Emitters} from '../emitters/emitters';
import {formatDate } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message = '';
  authenticated = false;
  today= new Date();
  todaysDataTime = '';

  constructor(
    private http: HttpClient,
  ) {
      this.todaysDataTime = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0300');
  }

  ngOnInit(): void {
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));
    this.http.get('http://localhost:8080/api/validatetoken', {withCredentials: true, headers: headers_object}).subscribe(
      (res: any) => {
        this.message = `Welcome, ${res.username}! Feel free to use web-app!`;
        localStorage.setItem('username', <string>res.username);
        console.log(localStorage.getItem('username'));
        Emitters.authEmitter.emit(true);
      },
      err => {
        this.message = 'You are not logged in';
        Emitters.authEmitter.emit(false);
      }
    );
    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
      }
    );
  }

}
