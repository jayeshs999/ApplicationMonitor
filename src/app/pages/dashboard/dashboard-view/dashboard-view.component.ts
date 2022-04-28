import { Component, OnInit } from '@angular/core';
import { API } from 'src/app/API';
import { HttpServiceService } from 'src/app/http-service.service';
import { AggregateFunctions } from './aggregateFunctions';
import { DatabaseMetrics } from './databaseMetrics';
import { NodeMetrics } from './nodeMetrics';
import { TimePeriods } from './timePeriods';
import { WindowPeriods } from './windowPeriods';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit {
  nodeCells : any = [];
  databaseCells : any = [];
  nodesToTrack : any[] = []
  databasesToTrack : any[] = []
  listNodes : any[] = []
  listDatabases : any = [];
  nodeCellModalOpen = false;
  databaseCellModalOpen = false;

  timePeriod : any;

  nodeCellForm = {
    'name' : '',
    'metric' : '',
    'aggregateFunction' : '',
    'window' : {
      'type' : '',
      'value' : undefined,
    },
    'data' : undefined,
    'timestamps' : undefined
  }
  
  databaseCellForm = {
    'name' : '',
    'metric' : '',
    'aggregateFunction' : '',
    'window' : {
      'type' : '',
      'value' : undefined,
    },
    'data' : undefined,
    'timestamps' : undefined
  }

  windowPeriods = WindowPeriods;
  aggregateFunctions = AggregateFunctions;
  nodeMetrics = NodeMetrics;
  databaseMetrics = DatabaseMetrics;
  timePeriods = TimePeriods;

  constructor(private httpService:HttpServiceService) { }

  ngOnInit(): void {
    this.httpService.getOrRedirectToLogin(API.ServerURL + API.GetNodesAndDatabases).subscribe({
      next: (res: any) => {
        this.listDatabases = [];
        let temp = {};
        res.data.forEach((ele) => {
          if(temp.hasOwnProperty(ele.ip)){
            temp[ele.ip].push({'database_id' : ele.database_id, 'name' : ele.name});
          }
          else{
            temp[ele.ip] = [{'database_id' : ele.database_id, 'name' : ele.name}];
          }
        });

        for (let key in temp) {
          if (temp.hasOwnProperty(key)) {
              this.listDatabases.push( { 'node' : key, 'databases' : temp[key] } );
          }
        }
      }
    })

    this.httpService.getOrRedirectToLogin(API.ServerURL + API.GetNodes).subscribe({
      next: (res: any) => {
        this.listNodes = res.data;
      }
    })
  }

  handleCreateCell(type: string) {
    if(type === 'node'){
      this.nodeCells.push(this.nodeCellForm);
      this.nodeCellModalOpen = false;
      this.nodeCellForm = {
        'name' : '',
        'metric' : '',
        'aggregateFunction' : '',
        'window' : {
          'type' : '',
          'value' : undefined,
        },
        'data' : undefined,
        'timestamps' : undefined
      }
      
    }
    else{
      this.databaseCells.push(this.databaseCellForm);
      this.databaseCellModalOpen = false;
      this.databaseCellForm = {
        'name' : '',
        'metric' : '',
        'aggregateFunction' : '',
        'window' : {
          'type' : '',
          'value' : undefined,
        },
        'data' : undefined,
        'timestamps' : undefined
      }
    }
  }

  refreshDashboard(){
    let form : any = {
      'time_period' : this.timePeriod,
      'node_cell_data' : this.nodeCells.map((ele: any) => {ele['window'] = (ele['window']['type'] == 'custom' && ele['window']['value']) || ele['window']['type']; return ele}),
      'database_cell_data' : this.databaseCells.map((ele: any) => {ele['window'] = (ele['window']['type'] == 'custom' && ele['window']['value']) || ele['window']['type']; return ele}), 
    }

    this.httpService.post(API.ServerURL + API.GetDashboardData, form).subscribe({
      next : (res: any) => {
        for(let i = 0; i < this.nodeCells.length; i++){
          this.nodeCells[i]['data'] = res[i]['data'];
          this.nodeCells[i]['timestamps'] = res[i]['timestamps'];
        }
      }
    })
  }
}
