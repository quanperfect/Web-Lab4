import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  submit(): void {
    // this.http.post('http://localhost:8080/api/authenticate', this.form.getRawValue(), {
    //   withCredentials: true
    // }).subscribe(() => this.router.navigate(['/']));
    this.http.post('http://localhost:8080/api/authenticate', this.form.getRawValue(), {withCredentials: true}).subscribe((response) => {
      let token = JSON.stringify(response);
      console.log(token);
      token = token.substring(8);
      token = token.substring(0,token.length - 2);
      localStorage.setItem('jwt', <string>token);
      console.log(localStorage.getItem('jwt'));
      this.router.navigate(['/']);
    },
      error => {
        alert("Invalide credentials");
      }
    );
  }
}
