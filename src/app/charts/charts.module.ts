import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart/line-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [
    LineChartComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  exports : [
    LineChartComponent
  ]
})
export class ChartsModule { }
