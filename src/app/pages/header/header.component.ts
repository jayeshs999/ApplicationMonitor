import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'src/app/API';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user : string;
  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit(): void {
    this.http.get(API.ServerURL + API.CheckLoginURL, {withCredentials:true}).subscribe({
      next : (data:any)=>{this.user = data.user;console.log(this.user)}
    })
  }

  logout() {
    this.http.get(API.ServerURL + API.LogoutURL, {withCredentials : true}).subscribe({
      next : (res) => this.router.navigate(['/login']),
    })
  }
}
