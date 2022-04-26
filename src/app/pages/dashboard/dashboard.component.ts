import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    data = [
      {
        title: 'Title 1'
      },
      {
        title: 'Title 2'
      },
      {
        title: 'Title 3'
      },
      {
        title: 'Title 4'
      },
      {
        title: 'Title 5'
      },
      {
        title: 'Title 6'
      }
    ];

  constructor() { }

  ngOnInit(): void {
  }

}
