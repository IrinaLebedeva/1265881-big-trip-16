import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ChartSettings = {
  BAR_HEIGHT: 55,
  DATASETS_BACKGROUND_COLOR: '#ffffff',
  DATASETS_HOVER_BACKGROUND_COLOR: '#ffffff',
  DATALABELS_FONT_COLOR: '#000000',
  TITLE_FONT_COLOR: '#000000',
  TICKS_FONT_COLOR: '#000000',
};

class RenderChart {
  #settings = null;

  constructor(settings = ChartSettings) {
    this.#settings = {...ChartSettings, ...settings};
  }

  /**
   * @param {HTMLElement} container
   * @param {Array.<string>} labels
   * @param {Array.<Number>} data
   * @param {Function} formatterFunction
   * @param {String} titleText
   * @return {Object} Chart instance
   */
  getInstance = (container, labels, data, formatterFunction, titleText) => {
    container.height = this.#settings.BAR_HEIGHT * labels.length;

    return new Chart(container, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.#settings.DATASETS_BACKGROUND_COLOR,
          hoverBackgroundColor: this.#settings.DATASETS_HOVER_BACKGROUND_COLOR,
          anchor: 'start',
          barThickness: 44,
          minBarLength: 100,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: this.#settings.DATALABELS_FONT_COLOR,
            anchor: 'end',
            align: 'start',
            formatter: (val) => formatterFunction(val),
          },
        },
        title: {
          display: true,
          text: titleText,
          fontColor: this.#settings.TITLE_FONT_COLOR,
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: this.#settings.TICKS_FONT_COLOR,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}

export {RenderChart};
