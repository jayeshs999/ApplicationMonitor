import { ChartOptions } from "src/app/chartoptions.type";

export function LineChartConfig(data, metadata) {
    let config : Partial<ChartOptions> =  {
        series: undefined,
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: metadata.name,
          align: "left"
        },
        grid: {
          row: {
            colors: ["transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          type   : "datetime",
        },
        tooltip : {
            theme : 'dark',
        }
      };
    return config
}