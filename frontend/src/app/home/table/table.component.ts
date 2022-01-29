import { Component, OnInit } from '@angular/core';
import {Result} from "../../models/result";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  public results: Result[];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));

    this.http.get('http://localhost:8080/api/point/all',{withCredentials: true, headers: headers_object}  ).subscribe((response) => {
      this.results = <Result[]>response;
    });
  }

  refreshTable()  : void {
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));

    this.http.get('http://localhost:8080/api/point/all',{withCredentials: true, headers: headers_object}  ).subscribe((response) => {
      this.results = <Result[]>response;
    });
  }

}
