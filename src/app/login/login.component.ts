import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { API } from '../API';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient, private router: Router, private notification: NzNotificationService) { }

  ngOnInit(): void {

  }

  login() {
    this.http.post(API.ServerURL + API.LoginURL, this.loginForm.value,{withCredentials : true}).subscribe({
      next: (res) => {
        this.router.navigate(['/pages']);
      },
      error: (err) => {
        console.log(err);
        this.notification.error('Login Failed', 'Please check your username and password', {nzDuration : 2000});
      }
    }
    );
  }

}
