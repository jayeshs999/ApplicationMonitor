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
  nodeCells: any[] = [];
  databaseCells: any = [];
  nodesToTrack: any[] = []
  databasesToTrack: any[] = []
  listNodes: any[] = []
  listDatabases: any = [];
  nodeCellModalOpen = false;
  databaseCellModalOpen = false;
  autoRefreshChecked = false;
  autoRefreshIntervalObject  : any = undefined;

  timePeriod: any;

  nodeCellForm = {
    'name': '',
    'metric': '',
    'aggregateFunction': '',
    'window': {
      'type': '',
      'value': undefined,
    },
    'data': ([] as any[]),
    'timestamps': undefined
  }

  databaseCellForm = {
    'name': '',
    'metric': '',
    'aggregateFunction': '',
    'window': {
      'type': '',
      'value': undefined,
    },
    'data': ([] as any[]),
    'timestamps': undefined
  }

  windowPeriods = WindowPeriods;
  aggregateFunctions = AggregateFunctions;
  nodeMetrics = NodeMetrics;
  databaseMetrics = DatabaseMetrics;
  timePeriods = TimePeriods;

  constructor(private httpService: HttpServiceService) { }

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
  }

  handleCreateCell(type: string) {
    if (type === 'node') {
      this.nodeCells.push(this.nodeCellForm);
      this.nodeCellModalOpen = false;
      this.nodeCellForm = {
        'name': '',
        'metric': '',
        'aggregateFunction': '',
        'window': {
          'type': '',
          'value': undefined,
        },
        'data': ([] as any[]),
        'timestamps': undefined
      }

    }
    else {
      this.databaseCells.push(this.databaseCellForm);
      this.databaseCellModalOpen = false;
      this.databaseCellForm = {
        'name': '',
        'metric': '',
        'aggregateFunction': '',
        'window': {
          'type': '',
          'value': undefined,
        },
        'data': ([] as any[]),
        'timestamps': undefined
      }
    }
    this.refreshDashboard()
  }

  refreshDashboard() {
    for (let i = 0; i < this.nodeCells.length; i++) {
      let ele = JSON.parse(JSON.stringify(this.nodeCells[i]));
      ele['window'] = ele['window']['type'] == 'custom' ? ele['window']['value'] : ele['window']['type']

      let form: any = {
        'time_period': this.timePeriod,
        'type': 'node',
        'entities': this.nodesToTrack,
        'cell_data': ele
      }
      this.httpService.post(API.ServerURL + API.GetDashboardData, form).subscribe({
        next: (res: any) => {
            console.log(res);
            this.nodeCells[i]['data'] = res;
            // this.nodeCells[i]['data'] = res['data'];
            // this.nodeCells[i]['timestamps'] = res['timestamps'];
        }
      })
    }
    
    for (let i = 0; i < this.databaseCells.length; i++) {
      let ele = JSON.parse(JSON.stringify(this.databaseCells[i]));
      ele['window'] = ele['window']['type'] == 'custom' ? ele['window']['value'] : ele['window']['type']

      let form: any = {
        'time_period': this.timePeriod,
        'type': 'database',
        'entities': this.databasesToTrack,
        'cell_data': ele
      }
      this.httpService.post(API.ServerURL + API.GetDashboardData, form).subscribe({
        next: (res: any) => {
            console.log(res)
            this.databaseCells[i]['data'] = res;
            // this.databaseCells[i]['data'] = res['data'];
            // this.databaseCells[i]['timestamps'] = res['timestamps'];
        }
      })
    }
  }

  toggleAutoRefresh(){
    this.autoRefreshChecked = !this.autoRefreshChecked;
    if(this.autoRefreshChecked){
      this.autoRefreshIntervalObject = setInterval(this.refreshDashboard,10000);
    }
    else{
      clearInterval(this.autoRefreshIntervalObject);
      this.autoRefreshIntervalObject = undefined;
    }
  }

  ngOnDestroy() {
    if (this.autoRefreshIntervalObject) {
      clearInterval(this.autoRefreshIntervalObject);
    }
  }
}
