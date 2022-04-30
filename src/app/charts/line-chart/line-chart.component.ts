import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/chartoptions.type';
import { convertToNumbers } from '../ISOtonumber';
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
      console.log(value)
      if(value.length != 0)
        this.chart.updateSeries(convertToNumbers(this._chartSeries), true);
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
  }

  ngOnInit(): void {
    console.log(this.chartSeries);
    console.log(this.chartMetadata)
    this.config = LineChartConfig(this.chartSeries, this.chartMetadata);
  }

}
