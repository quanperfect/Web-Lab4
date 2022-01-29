import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Result} from "../../models/result";
import {Emitters} from "../../emitters/emitters";

type SvgInHtml = HTMLElement & SVGSVGElement;


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  form: FormGroup;
  xValidity = true;
  yValidity = true;
  rValidity = true;
  result: Result = new Result(null, null, null, true);
  graph: HTMLElement;
  animationSnippet: number;
  size: number;
  public results: Result[];
  newPoint = null;
  graphR = 'R';
  graphImport = document.getElementById('graph-import');




  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.graphR = 'R';
  }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      x: '',
      y: '',
      r: ''
    });

  }

  ngAfterContentInit(): void {
    this.graph = document.getElementById("graph-svg");
    this.size = this.graph.getBoundingClientRect().width;
    this.animationSnippet = (this.size - this.size / 6) / 2;

    // var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));
    // this.http.get('http://localhost:8080/api/point/all',{withCredentials: true, headers: headers_object}  ).subscribe((response) => {
    //   this.drawAllResults(<Result[]>response);
    //   this.results = <Result[]>response;
    // });
  }

  check(): void {
    this.result.x = this.form.get("x").value;
    this.result.y = this.form.get("y").value;
    this.result.r = this.form.get("r").value;
    this.xValidity = true;
    this.yValidity = true;
    this.rValidity = true;

    if (!isFinite(this.result.x) || this.result.x.toString().length == 0 || !(-4 <= this.result.x && this.result.x <= 4)) {
      console.log("not valid x");
      this.xValidity = false;
    }
    else if (!isFinite(this.result.y) || this.result.y.toString().length == 0 || !(-5 <= this.result.y && this.result.y <= 3)) {
      console.log("not valid y");
      this.yValidity = false;
    }
    else if (!isFinite(this.result.r) || this.result.r.toString().length == 0 || !(0 < this.result.r && this.result.r <= 4)) {
      console.log("not valid r" + this.result.x + " " + this.result.y + " " + this.result.r);
      this.rValidity = false;
    }
    else {
      console.log("here");
      this.xValidity = true;
      this.yValidity = true;
      this.rValidity = true;
      var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));
      this.http.post('http://localhost:8080/api/point/add',this.result, {withCredentials: true, headers: headers_object}).subscribe((response) => {
        this.drawResult(<Result>response);

        this.http.get('http://localhost:8080/api/point/all',{withCredentials: true, headers: headers_object}  ).subscribe((response) => {
          this.drawAllResults(<Result[]>response);
          this.results = <Result[]>response;
        });

        },
        error => {
          console.log("save result error");
          console.log(error.status + error.message);
          if (error.status === 401 || error.status === 403) {
            alert("Token expired, please log in again. Unauthorized access, 403.")
            this.logout();
          }
          else {
            alert("Bad request");
          }
        })
    }
  }

  logout(): void {
    Emitters.authEmitter.emit(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
  }

  drawResult(result: Result) {
    if (result.r != 0) {
      let graphSvg = document.getElementById('graph-svg') as SvgInHtml;
      let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      let GRAPH_WIDTH = 493;
      let INDENT = 88;
      // circle.setAttributeNS(null, 'cx', String(GRAPH_WIDTH / 2 + (GRAPH_WIDTH / 2 - INDENT) * result.x / Math.abs(result.r)));
      // circle.setAttributeNS(null, 'cy', String(GRAPH_WIDTH / 2 - (GRAPH_WIDTH / 2 - INDENT) * result.y / Math.abs(result.r)));
      circle.setAttributeNS(null, 'cx', String(GRAPH_WIDTH / 2 + (GRAPH_WIDTH / 2 - INDENT) * result.x / Math.abs(result.r)));
      circle.setAttributeNS(null, 'cy', String(GRAPH_WIDTH / 2 - (GRAPH_WIDTH / 2 - INDENT) * result.y / Math.abs(result.r)));
      circle.setAttributeNS(null, 'r', String(5));
      circle.setAttribute('data-x', String(result.x));
      circle.setAttribute('data-y', String(result.y));
      circle.classList.toggle("pointer");
      if (result.hitGraph)
        circle.style.fill = "#4eda0a";
      else circle.style.fill = "#FF1801";
      graphSvg.appendChild(circle);
    }
  }

  drawAllResults(resultList: Result[]) {
    let pointers = document.querySelectorAll(".pointer") as NodeListOf<HTMLElement>;
    for (let i = 0; i < pointers.length; i++) {
      pointers[i].setAttributeNS(null, "r", String(0));
    }
    let resultat = new Result(null, null, null, true);
    console.log("started drawing");
    setTimeout(() => {
      for (let i = 0; i < resultList.length; i++) {
        this.drawResult(resultList[i]);
      }
    }, 0);
    //
    // let data = Array();
    // let table = document.getElementById("result-table") as HTMLTableElement;
    // let rows = table.tBodies[0].rows;
    // setTimeout(() => {
    //   for (let i: number = 0; i < rows.length; i++) {
    //     data[i] = Array();
    //     for (let j = 0; j < 3; j++) {
    //       data[i][j] = rows[i].childNodes[j].textContent;
    //     }
    //   }
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i][0])
    //       this.drawResult(new Result(null, data[i][0], data[i][1], this.result.r, null));
    //   }
    // }, 0);
  }

  clearGraphAndTable() {
    this.graph = document.getElementById("graph-svg");
    let pointers = document.querySelectorAll(".pointer");
    for (let i = 0; i < pointers.length; i++) {
      this.graph.removeChild(pointers[i]);
    }
    this.graph.remove();
    this.graphR = this.form.get("r").value;

    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));
    this.http.delete('http://localhost:8080/api/point/delete', {withCredentials: true, headers: headers_object}).subscribe((response) => {
      this.results = <Result[]>response;
    }, error => {
      alert("Token expired, please log in again. Unauthorized access, 403.");
      this.logout();
    });
    console.log("cleared");
  }

  clearButton() {
    this.graph = document.getElementById("graph-svg");
    let pointers = document.querySelectorAll(".pointer");
    for (let i = 0; i < pointers.length; i++) {
      this.graph.removeChild(pointers[i]);
    }

    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));
    this.http.delete('http://localhost:8080/api/point/delete', {withCredentials: true, headers: headers_object}).subscribe((response) => {
      this.results = <Result[]>response;
    }, error => {
      alert("Token expired, please log in again. Unauthorized access, 403.");
      this.logout();
    });
    console.log("cleared");
  }

  addResultFromClick(event) {
    this.clicked(event);
    console.log("click graph processing");
    this.result.r = this.form.get("r").value;
    let GRAPH_WIDTH = 493;
    let INDENT = 88;
    if (this.result.r == null || !(-4 <= this.result.r && this.result.r <= 4)) {
      this.rValidity = false;
      return false;
    }
    let curR = this.result.r;
    let canvasX = (this.newPoint.x - GRAPH_WIDTH / 2) * Math.abs(curR) / (GRAPH_WIDTH / 2 - INDENT);
    canvasX = parseFloat(canvasX.toString().substring(0, 5));
    let canvasY = (-this.newPoint.y + GRAPH_WIDTH / 2) * Math.abs(curR) / (GRAPH_WIDTH / 2 - INDENT);
    canvasY = parseFloat(canvasY.toString().substring(0, 5));
    this.result.x = canvasX;
    this.result.y = canvasY;
    if (!isFinite(this.result.x) || !(-4 <= this.result.x && this.result.x <= 4)) {
      console.log("here");
      this.xValidity = false;
      return false;
    } else if (!isFinite(this.result.y) || !(-5 <= this.result.y && this.result.y <= 3)) {
      console.log("here");
      this.yValidity = false;
      return false;
    } else if (!isFinite(this.result.r) || !(-4 <= this.result.r && this.result.r <= 4)) {
      console.log("here");
      this.rValidity = false;
      return false;
    } else {
      console.log("here");
      this.xValidity = true;
      this.yValidity = true;
      this.rValidity = true;

      var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('jwt'));
      this.http.post('http://localhost:8080/api/point/add',this.result, {withCredentials: true, headers: headers_object}).subscribe((response) => {
          this.drawResult(<Result>response);

          this.http.get('http://localhost:8080/api/point/all',{withCredentials: true, headers: headers_object}  ).subscribe((response) => {
            this.drawAllResults(<Result[]>response);
            this.results = <Result[]>response;
          });

        },
        error => {
          console.log("save result error");
          console.log(error.status + error.message);
          if (error.status === 401 || error.status === 403) {
            alert("Token expired, please log in again. Unauthorized access, 403.");
            this.logout();
          }
          else {
            alert("Bad request");
          }
        })

      return true;
    }
  }

  getPoint(e) {
    let graphSvg = document.getElementById('graph-svg') as SvgInHtml;
    let point = graphSvg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    let ctm = graphSvg.getScreenCTM().inverse();
    point = point.matrixTransform(ctm);
    return point;
  }

  clicked(e) {
    let m = this.getPoint(e);
    this.newPoint = m;
  }

  // calculateHit(x, y, r) {
  //   return this.calculateSectionOne(x, y, r) || this.calculateSectionTwo(x, y, r) || this.calculateSectionThree(x, y, r);
  // }
  //
  // calculateSectionOne(x, y, r) {
  //   return (x*x + y*y <= r*r/4 && x>=0 && y>=0);
  // }
  //
  // calculateSectionTwo(x, y, r) {
  //   return (y >= 0 && y <= r && x <=0 && x >= -r);
  // }
  //
  // calculateSectionThree(x, y, r) {
  //   return (x >= 0 && x <= r && y <= 0 && y >= -r && y >= (x-r));
  // }
  //
  // redrawResults(e) {
  //   this.result.r = e;
  //   let pointers = document.querySelectorAll(".pointer") as NodeListOf<HTMLElement>;
  //   for (let i = 0; i < pointers.length; i++) {
  //     pointers[i].setAttributeNS(null, "r", String(0));
  //   }
  //   if (e >= -4 && e <= 4 && e && e != 0) {
  //     console.log("drawing");
  //     let pointers = document.querySelectorAll(".pointer") as NodeListOf<HTMLElement>;
  //     let initX;
  //     let initY;
  //     let moveX;
  //     let moveY;
  //     for (let i = 0; i < pointers.length; i++) {
  //       initX = pointers[i].getAttribute("data-x");
  //       initY = pointers[i].getAttribute("data-y");
  //       moveX = this.size / 2 + this.animationSnippet * initX / Math.abs(e);
  //       moveY = this.size / 2 - this.animationSnippet * initY / Math.abs(e);
  //       if (this.calculateHit(initX, initY, Math.abs(e))) {
  //         pointers[i].style.fill = "#535cc5";
  //       } else pointers[i].style.fill = "#c553a1";
  //       pointers[i].setAttributeNS(null, "cx", String(moveX));
  //       pointers[i].setAttributeNS(null, "cy", String(moveY));
  //       pointers[i].setAttributeNS(null, "r", String(5));
  //     }
  //   }
  // }

}
