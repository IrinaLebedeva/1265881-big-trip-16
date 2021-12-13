import {EmptyPointsListMessage} from '../view/empty-points-list-message.js';
import {PointsList} from '../view/points-list.js';
import {PointPresenter} from './point-presenter.js';
import {renderElement} from '../utils/manipulate-dom-element.js';
import {Sort} from '../view/sort.js';
import {updateArrayElement} from '../utils/update-array-element.js';

class TripRoutePresenter {
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
   */
  init = (tripPoints) => {
    this.#tripPoints = tripPoints;

    this.#renderTripRoute();
  }

  #renderEmptyTripRoute = () => renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);

  #renderTripRoute = () => {
    if (!this.#tripPoints.length) {
      this.#renderEmptyTripRoute();
    } else {
      renderElement(this.#tripRouteContainer, this.#sort);
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
    const pointPresenter = new PointPresenter(this.#pointsList, this.#handlePointUpdate);
    pointPresenter.init(pointItem);
    this.#tripPointsPresenter.set(pointItem.id, pointPresenter);
  }

  #handlePointUpdate = (updatedPoint) => {
    this.#tripPoints = updateArrayElement(this.#tripPoints, updatedPoint);
    this.#tripPointsPresenter.get(updatedPoint.id).init(updatedPoint);
  }
}

export {TripRoutePresenter};
