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

  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit(): void {
    
  }

  logout() {
    this.http.get(API.ServerURL + API.LogoutURL, {withCredentials : true}).subscribe({
      next : (res) => this.router.navigate(['/login']),
    })
  }
}
