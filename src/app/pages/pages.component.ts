import { Component, OnInit } from '@angular/core';
import { API } from '../API';
import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  title = 'ApplicationMonitor';
  isCollapsed = true;
  links = [
    {
      name : 'Dashboard',
      url : '/pages/dashboard',
      icon : 'dashboard'
    },
    {
      name : 'Alerts',
      url : '/pages/alerts',
      icon : 'bell'
    },
  ]
  constructor(private httpService : HttpServiceService) { }

  ngOnInit(): void {
    this.httpService.getOrRedirectToLogin(API.ServerURL + API.CheckLoginURL).subscribe({
      next : (res:any) => {
        console.log(res)
        if(res.user == 'admin'){
          this.links.push(    {
            name : 'Settings',
            url : '/pages/settings',
            icon : 'setting'
          })
        }
      }
    });

  }

}
