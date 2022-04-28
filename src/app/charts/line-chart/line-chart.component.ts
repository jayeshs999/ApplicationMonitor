import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/chartoptions.type';
import { LineChartConfig } from './line-chart.config';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit{
    private _chartSeries: any;
    private _additionalOptions : any;
    config : Partial<ChartOptions> = {};
    @ViewChild("chart", {static: false}) chart: ChartComponent;

    @Input() set chartSeries(value: any) {
       this._chartSeries = value;
      this.chart.updateSeries(this._chartSeries, true);
    }
    
    get chartSeries(): string {
    
        return this._chartSeries;
    
  }
  constructor() { 
    this.config = LineChartConfig();
  }

  ngOnInit(): void {
  }

}
