import {EmptyPointsListMessage} from '../view/empty-points-list-message.js';
import {PointsList} from '../view/points-list.js';
import {PointPresenter} from './point-presenter.js';
import {renderElement} from '../utils/manipulate-dom-element.js';
import {Sort} from '../view/sort.js';
import {
  DEFAULT_SORT_TYPE,
  SortType,
} from '../const.js';
import {
  sortPointsByDateDesc,
  sortPointsByPriceDesc,
  sortPointsByTimeDesc,
} from '../utils/sort-points.js';
import {updateArrayElement} from '../utils/update-array-element.js';

class TripRoutePresenter {
  #currentSortType = DEFAULT_SORT_TYPE;
  #offers = null;
  #tripRouteContainer = null;
  #tripPoints = [];

  #emptyPointsListMessage = new EmptyPointsListMessage();
  #pointsList = new PointsList();
  #sort = new Sort();
  #tripPointsPresenter = new Map();

  constructor(tripRouteContainer) {
    this.#tripRouteContainer = tripRouteContainer;
  }

  /**
   * @param {Object[]} tripPoints
   * @param {Object[]} offers
   */
  init = (tripPoints, offers) => {
    this.#tripPoints = tripPoints;
    this.#offers = offers;
    this.#sortPoints(this.#currentSortType);

    this.#renderTripRoute();
  }

  #clearTripPoints = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
  }

  #renderEmptyTripRoute = () => renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);

  #renderTripRoute = () => {
    if (!this.#tripPoints.length) {
      this.#renderEmptyTripRoute();
    } else {
      renderElement(this.#tripRouteContainer, this.#sort);
      this.#sort.setSortTypeChange(this.#handleSortChange);
      renderElement(this.#tripRouteContainer, this.#pointsList);
      this.#renderTripPoints();
    }
  }

  #renderTripPoints = () => {
    for (const point of this.#tripPoints) {
      this.#renderPoint(point);
    }
  }

  /**
   * @param {Object} pointItem
   */
  #renderPoint = (pointItem) => {
    const pointPresenter = new PointPresenter(this.#pointsList, this.#handlePointUpdate, this.#handleModeUpdate);
    pointPresenter.init(pointItem, this.#offers);
    this.#tripPointsPresenter.set(pointItem.id, pointPresenter);
  }

  #handleModeUpdate = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointUpdate = (updatedPoint) => {
    this.#tripPoints = updateArrayElement(this.#tripPoints, updatedPoint);
    this.#tripPointsPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearTripPoints();
    this.#renderTripPoints();
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY_DESC:
        this.#tripPoints.sort(sortPointsByDateDesc);
        break;
      case SortType.TIME_DESC:
        this.#tripPoints.sort(sortPointsByTimeDesc);
        break;
      case SortType.PRICE_DESC:
        this.#tripPoints.sort(sortPointsByPriceDesc);
        break;
      default:
        this.#tripPoints.sort(sortPointsByDateDesc);
    }
    this.#currentSortType = sortType;
  }
}

export {TripRoutePresenter};
