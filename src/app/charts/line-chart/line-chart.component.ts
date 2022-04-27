import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/chartoptions.type';
import { LineChartConfig } from './line-chart.config';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  config : Partial<ChartOptions> = {};
  @ViewChild("chart", {static: false}) chart: ChartComponent;
  constructor() { 
    this.config = LineChartConfig();
  }

  ngOnInit(): void {
  }

}
