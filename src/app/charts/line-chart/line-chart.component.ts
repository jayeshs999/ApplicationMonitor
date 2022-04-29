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
    private _chartMetaData : any;
    config : Partial<ChartOptions> = {};
    @ViewChild("chart", {static: false}) chart: ChartComponent;

    @Input() set chartSeries(value: any) {
      console.log(value)
      this._chartSeries = value;
      this.chart.updateSeries(this._chartSeries, true);
    }
    
    get chartSeries(): any {
    
        return this._chartSeries;
    
    }

    @Input() set chartMetadata(value: any) {
      console.log(value);
      this._chartMetaData = value;
    }
    
    get chartMetadata(): any {
    
        return this._chartMetaData;
    
    }
  constructor() { 
    console.log(this.chartSeries);
    console.log(this.chartMetadata)
    this.config = LineChartConfig(this.chartSeries, this.chartMetadata);
  }

  ngOnInit(): void {
  }

}
