import Chart from 'chart.js';
import utils from './../utils';
import LineChartDataSet from './LineChartDataSet';
import BarChartDataSet from './BarChartDataSet';

export default class SingleChart {
  constructor($canvas, labels, values, config, ownDatasets) {
    const datasets = ownDatasets || this.selectDataSet(config, values);


    const $chart = $($canvas);
    const data = {
      labels,
      datasets
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: (!config.money) ? null : {
        yAxes: [{
          ticks: {
            callback(label) {
              return `RD$ ${utils.CurrencyFormat(label)}`;
            },
            beginAtZero: true
          }
        }]
      },
      tooltips: {
        callbacks: {
          label(tooltipItem) {
            if (!config.money) {
              return tooltipItem.yLabel;
            }
            return `RD$  ${utils.CurrencyFormat(tooltipItem.yLabel)}`;
          }
        }
      }
    };

    this.chart = new Chart($chart, {
      type: config.type,
      data,
      options
    });

    $chart.height = 390;
    this.multiple = (ownDatasets) || false;
  }

  update(values) {
    if (this.multiple) {
      values.forEach((dataset, i) => {
        this.chart.data.datasets[i].data = dataset.data;
      });
    } else {
      this.chart.config.data.datasets[0].data = values;
    }
    this.chart.update();
  }

  selectDataSet(config, values) {
    const datasets = config.type === 'line' ? LineChartDataSet : BarChartDataSet;
    datasets.values = values;
    datasets.label = config.title;
    return datasets;
  }
}
