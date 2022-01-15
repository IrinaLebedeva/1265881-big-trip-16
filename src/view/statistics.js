import {
  getDuration,
  getFormattedDuration
} from '../utils/dates-diff.js';
import {pointTypes} from '../const.js';
import {RenderChart} from '../utils/render-chart.js';
import {SmartView} from './smart-view.js';
import {sortByValueDesc} from '../utils/sort-objects.js';

const getPointTypeName = (type) => type.toString().toUpperCase();

const getMoneyChartData = (points) => {
  const chartData = [];
  const data = [];
  for (const point of points) {
    data[point.type] = data[point.type] ? data[point.type] + point.basePrice : point.basePrice;
  }

  for (const pointType of pointTypes) {
    if (data[pointType]) {
      chartData.push({
        label: getPointTypeName(pointType),
        value: data[pointType],
      });
    }
  }

  return chartData.sort(sortByValueDesc);
};

const getTypeChartData = (points) => {
  const chartData = [];
  const data = [];
  for (const point of points) {
    data[point.type] = data[point.type] ? ++data[point.type] : 1;
  }

  for (const pointType of pointTypes) {
    if (data[pointType]) {
      chartData.push({
        label: getPointTypeName(pointType),
        value: data[pointType],
      });
    }
  }

  return chartData.sort(sortByValueDesc);
};

const getTimeChartData = (points) => {
  const chartData = [];
  const data = [];
  for (const point of points) {
    const diffInMinutes = getDuration(point.dateFrom, point.dateTo);
    data[point.type] = data[point.type] ? data[point.type] + diffInMinutes : diffInMinutes;
  }

  for (const pointType of pointTypes) {
    if (data[pointType]) {
      chartData.push({
        label: getPointTypeName(pointType),
        value: data[pointType],
      });
    }
  }

  return chartData.sort(sortByValueDesc);
};

const getFormattedMoneyValues = (val) => `€ ${val}`;

const getFormattedTypeValues = (val) => `${val}x`;

const renderMoneyChart = (container, points) => {
  const moneyChartData = getMoneyChartData(points);
  return new RenderChart().getInstance(
    container,
    moneyChartData.map((item) => item.label),
    moneyChartData.map((item) => item.value),
    getFormattedMoneyValues,
    'MONEY'
  );
};

const renderTypeChart = (container, points) => {
  const typeChartData = getTypeChartData(points);
  return new RenderChart().getInstance(
    container,
    typeChartData.map((item) => item.label),
    typeChartData.map((item) => item.value),
    getFormattedTypeValues,
    'TYPE'
  );
};

const renderTimeChart = (container, points) => {
  const timeChartData = getTimeChartData(points);
  return new RenderChart().getInstance(
    container,
    timeChartData.map((item) => item.label),
    timeChartData.map((item) => item.value),
    getFormattedDuration,
    'TIME'
  );
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
);

class Statistics extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;
  _data = null;

  constructor(points) {
    super();

    this._data = points;

    this.#setCharts();
  }

  /**
   * @return {String}
   */
  get template() {
    return createStatisticsTemplate();
  }

  #setCharts = () => {
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    this.#moneyChart = renderMoneyChart(moneyCtx, this._data);
    this.#typeChart = renderTypeChart(typeCtx, this._data);
    this.#timeChart = renderTimeChart(timeCtx, this._data);
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }
    if (this.#typeChart) {
      this.#typeChart.destroy();
      this.#typeChart = null;
    }
    if (this.#timeChart) {
      this.#timeChart.destroy();
      this.#timeChart = null;
    }
  }
}

export {Statistics};
