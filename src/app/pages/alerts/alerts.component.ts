import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { API } from 'src/app/API';
import { HttpServiceService } from 'src/app/http-service.service';
import { DatabaseMetrics } from '../dashboard/dashboard-view/databaseMetrics';
import { NodeMetrics } from '../dashboard/dashboard-view/nodeMetrics';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  confirmDeleteModal?: NzModalRef;

  alertList = [
        {
            id : 'ashjsj',
            name: 'Title 1',
            description : 'Description 1',
            priority : 0,
            unacknowledged : 3,
        },
      ]
  
  createModalOpen : boolean = false;
  currAlert : any = {
    id : undefined,
    logs : undefined,
    name : undefined,
  };
  viewHistoryModalOpen : boolean = false;

  PRIORITY = [
    {
      name : 'CRIT',
      value : 0,
    },
    {
      name : 'WARN',
      value : 1,
    },
    {
      name : 'INFO',
      value : 2,
    },
    {
      name : 'OK',
      value : 3,
    }
  ]

  ENTITY = ['node','database']

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


  constructor(private httpService : HttpServiceService, private notification : NzNotificationService, private modal: NzModalService) { }

  syncAlerts(){
    this.httpService.get(API.ServerURL + API.GetAlerts).subscribe({
      next: (res: any) => {
        this.alertList = res.alerts;
      }
    });
  }

  ngOnInit(): void {
    

    this.httpService.getOrRedirectToLogin(API.ServerURL + API.GetNodesAndDatabases).subscribe({
      next: (res: any) => {
        this.listDatabases = [];
        let temp = {};
        res.data.forEach((ele) => {
          if (temp.hasOwnProperty(ele.ip)) {
            temp[ele.ip].push({ 'database_id': ele.database_id, 'name': ele.name });
          }
          else {
            temp[ele.ip] = [{ 'database_id': ele.database_id, 'name': ele.name }];
          }
        });

        for (let key in temp) {
          if (temp.hasOwnProperty(key)) {
            this.listDatabases.push({ 'node': key, 'databases': temp[key] });
          }
        }
      }
    })

    this.httpService.getOrRedirectToLogin(API.ServerURL + API.GetNodes).subscribe({
      next: (res: any) => {
        this.listNodes = res.data.map((ele) => ele.ip);
      }
    })

    this.syncAlerts()
  }

  handleCancel(){
    this.createModalOpen = false
  }

  handleOk(){
    this.httpService.postAndNotify(API.ServerURL + API.CreateAlert, this.newAlert, {},(res)=>{this.syncAlerts()})
    this.createModalOpen = false;
  }

  openViewHistoryModal(alert){
    this.currAlert = alert;
    this.httpService.get(API.ServerURL + API.GetAlertLogs, {
      params : {
        alert_id : this.currAlert.id
      }
    })
    .subscribe({
      next: (res: any) => {
        this.currAlert.logs = res.logs.map((ele)=>{return {'timest' : new Date(ele.timest), 'ack' : ele.ack }});
        this.viewHistoryModalOpen = true;
      },
      error: (err: any) => {
      }
    });
  }
  
  acknowledgeAlert(timest, index){
    console.log(this.currAlert.id, timest)
    this.httpService.post(API.ServerURL + API.AcknowledgeAlert, {
      alert_id : this.currAlert.id,
      timest : timest.toISOString()
    }).subscribe({ 
      next: (res:any) => {
        this.currAlert.logs[index].ack  = 1;
        this.currAlert.unacknowledged -= 1;
        this.notification.success('Success',res.message);

      },
      error: (err) => {
        this.notification.error('Error',err.error.err);
      }
    })
  }

  openDeleteModal(item){
    this.confirmDeleteModal = this.modal.confirm({
      nzTitle : 'Do you want to delete this alert?',
      nzContent : '',
      nzOnOk :  () =>{
        this.httpService.post(API.ServerURL + API.DeleteAlert, {
          alert_id : item.id
        }).subscribe({ 
          next: (res:any) => {
            this.notification.success('Success',res.message);
            this.syncAlerts();
          },
          error: (err) => {
            this.notification.error('Error',err.error.err);
          }
        })
      }
    }
    )
  }

}
