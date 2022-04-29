import { ChartOptions } from "src/app/chartoptions.type";

export function LineChartConfig(chartSeries: any, chartMetadata: any) {
    let config: Partial<ChartOptions> = {
        series: chartSeries,
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
            text: chartMetadata.name,
            align: "left"
        },
        grid: {
            row: {
                colors: ["transparent"], // takes an array which will be repeated on columns
                opacity: 0.5
            }
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                  return (new Date(value)).toString();
                }
              },
        },
        yaxis: {
            labels: {
              formatter: function (value) {
                return value.toFixed(2).toLocaleLowerCase();
              }
            },
          },
        tooltip: {
            theme: 'dark',
        }
    };
    return config
}