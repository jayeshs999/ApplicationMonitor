import { Component, OnInit } from '@angular/core';
import { API } from 'src/app/API';
import { HttpServiceService } from 'src/app/http-service.service';

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

  constructor(private httpService:HttpServiceService) { }

  ngOnInit(): void {
    this.httpService.get(API.ServerURL + API.GetNodesAndDatabases).subscribe({
      next: (res: any) => {
        this.listDatabases = [];
        let temp = {};
        res.data.array.forEach((ele) => {
          if(temp.hasOwnProperty(ele.ip)){
            temp[ele.ip].push(ele.database_id);
          }
          else{
            temp[ele.ip] = [ele.database_id];
          }
        });

        for (let key in temp) {
          if (temp.hasOwnProperty(key)) {
              this.listDatabases.push( { 'node' : key, 'databases' : temp[key] } );
          }
        }

        this.listNodes = res.data.map((ele: any) => ele.ip);
        this.listNodes = [...new Set(this.listNodes)];
      }
    })
  }

}
