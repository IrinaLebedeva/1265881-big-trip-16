import {AbstractObservable} from '../utils/abstract-observable.js';
import dayjs from 'dayjs';
import {
  FilterType,
  ViewUpdateType
} from '../const.js';
import {filter} from '../utils/filter.js';
import {sortPointsByDateDesc} from '../utils/sort-points.js';

const DIFFERENT_MONTHS_DATE_FORMAT = 'D MMM';
const EQUAL_MONTHS_DATE_FROM_FORMAT = 'MMM D';
const EQUAL_MONTHS_DATE_TO_FORMAT = 'D';

class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];
  #pointsSortedByDateDesc = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = points.map((point, index) => this.#adaptToClient(point, index));
    } catch (err) {
      this.#points = [];
    }
    this._notify(ViewUpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  updatePoint = async (updateType, updatedPoint) => {
    const updateElementIndex = this.#points.findIndex((item) => item.id === updatedPoint.id);

    if (updateElementIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const updatedPointFromServer = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, updateElementIndex),
        updatedPointFromServer,
        ...this.#points.slice(updateElementIndex + 1)
      ];

      this._notify(updateType, updatedPointFromServer);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (updateType, addedPoint) => {
    try {
      const response = await this.#apiService.addPoint(addedPoint);
      const addedPointFromServer = this.#adaptToClient(response);

      this.#points = [
        addedPointFromServer,
        ...this.#points,
      ];

      this._notify(updateType, addedPointFromServer);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  deletePoint = async (updateType, deletedPoint) => {
    const index = this.#points.findIndex((task) => task.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(deletedPoint);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient = (point) => {
    let destinationInfo = {};
    if (point['destination']['description'] !== null) {
      destinationInfo.description = point['destination']['description'];
    }
    if (point['destination']['pictures'] !== null) {
      destinationInfo.pictures = point['destination']['pictures'];
    }
    if (!Object.keys(destinationInfo).length) {
      destinationInfo = null;
    }

    const adaptedPoint = {
      ...point,
      id: Number(point['id']) + 1,
      backendId: point['id'],
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
      destinationInfo,
      destination: point['destination']['name'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  getPointsSummaryInfo = () => {
    if (!this.points.length) {
      return {
        title: '',
        dates: '',
        cost: '',
      };
    }

    this.#pointsSortedByDateDesc = this.#points.sort(sortPointsByDateDesc);
    return {
      title: this.getPointsSummaryTitle(),
      dates: this.getPointsSummaryDates(),
      cost: this.getPointsSummaryCost(),
    };
  };

  getPointsSummaryTitle = () => {
    const pointsNumber = this.#pointsSortedByDateDesc.length;
    let summaryTitle = '';
    if (pointsNumber === 1) {
      summaryTitle = this.#pointsSortedByDateDesc[0].destination;
    } else if (pointsNumber < 4) {
      const summaryPointTitles = [];
      this.#pointsSortedByDateDesc.forEach((point) => summaryPointTitles.push(point.destination));
      summaryTitle = summaryPointTitles.join(' &mdash; ');
    } else {
      summaryTitle = `${this.#pointsSortedByDateDesc[0].destination} &mdash; ... &mdash; ${this.#pointsSortedByDateDesc[pointsNumber - 1].destination}`;
    }
    return summaryTitle;
  }

  getPointsSummaryDates = () => {
    const pointsNumber = this.#pointsSortedByDateDesc.length;
    const dateFrom = this.#pointsSortedByDateDesc[0].dateFrom;
    if (pointsNumber === 1) {
      return dayjs(dateFrom).format(DIFFERENT_MONTHS_DATE_FORMAT);
    }

    let summaryDates = '';
    const dateTo = this.#pointsSortedByDateDesc[pointsNumber - 1].dateTo;

    if (dayjs(dateFrom).month() === dayjs(dateTo).month()) {
      summaryDates = `${dayjs(dateFrom).format(EQUAL_MONTHS_DATE_FROM_FORMAT)}&nbsp;&mdash;&nbsp;${dayjs(dateTo).format(EQUAL_MONTHS_DATE_TO_FORMAT)}`;
    } else {
      summaryDates = `${dayjs(dateFrom).format(DIFFERENT_MONTHS_DATE_FORMAT)}&nbsp;&mdash;&nbsp;${dayjs(dateTo).format(DIFFERENT_MONTHS_DATE_FORMAT)}`;
    }

    return summaryDates;
  }

  getPointsSummaryCost = () => (
    this.#points.reduce((summaryCost, point) => {
      let offersCost = 0;
      if (point.offers.length) {
        offersCost = point.offers.reduce((summaryOffersCost, offer) => summaryOffersCost + offer.price, 0);
      }
      return summaryCost + point.basePrice + offersCost;
    }, 0)
  )

  getFilteredPointsCountInfo = () => ({
    [FilterType.EVERYTHING]: this.#points.length,
    [FilterType.PAST]: filter[FilterType.PAST](this.#points).length,
    [FilterType.FUTURE]: filter[FilterType.FUTURE](this.#points).length,
  })
}

export {PointsModel};
