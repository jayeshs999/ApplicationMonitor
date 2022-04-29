import { Component, OnInit } from '@angular/core';
import { API } from 'src/app/API';
import { HttpServiceService } from 'src/app/http-service.service';
import { DatabaseMetrics } from '../dashboard/dashboard-view/databaseMetrics';
import { NodeMetrics } from '../dashboard/dashboard-view/nodeMetrics';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  data = [
        {
          title: 'Title 1'
        },
        {
          title: 'Title 2'
       },
      ]
  
  createModalOpen : boolean = false;
  PRIORITY = [
    {
      name : '  CRIT',
      value : 0
    },
    {
      name : 'WARN',
      value : 1
    },
    {
      name : 'INFO',
      value : 2
    },
    {
      name : 'OK',
      value : 3
    }
  ]

  newAlert : any = {
    name : '',
    description : '',
    entity : '',
    metric : '',
    entity_ids : [],
    threshold_1 : undefined,
    threshold_2 : undefined,
    threshold_type : '',
    alert_priority : 0,
    alert_message : '',
  }

  nodeMetrics = NodeMetrics;
  databaseMetrics = DatabaseMetrics; 
  listNodes : any[] = [];
  listDatabases : any[] = []; 


  constructor(private httpService : HttpServiceService) { }

  ngOnInit(): void {
  }

  handleCancel(){
    this.createModalOpen = false
  }

  handleOk(){
    this.httpService.postAndNotify(API.ServerURL + API.CreateAlert, this.newAlert)
    this.createModalOpen = false;
  }

}
