import { Component, OnInit } from '@angular/core';

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
      url : '/pages/dashboards',
      icon : 'dashboard'
    },
    {
      name : 'Alerts',
      url : '/pages/alerts',
      icon : 'bell'
    },
    {
      name : 'Settings',
      url : '/pages/settings',
      icon : 'setting'
    },
    {
      name : 'Visualize',
      url : '/pages/visualize',
      icon : 'area-chart'
    }
  ]
  constructor() { }

  ngOnInit(): void {

  }

}
