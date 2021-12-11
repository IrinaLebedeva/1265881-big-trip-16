import {EmptyPointsListMessage} from '../view/empty-points-list-message.js';
import {PointsList} from '../view/points-list.js';
import {PointPresenter} from './point-presenter.js';
import {renderElement} from '../utils/manipulate-dom-element.js';
import {Sort} from '../view/sort.js';

class TripRoutePresenter {
  #tripPointsContainer = null;
  #tripRouteContainer = null;
  #tripPoints = [];

  #emptyPointsListMessage = new EmptyPointsListMessage();
  #pointsList = new PointsList();
  #sort = new Sort();

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
    this.#tripPointsContainer = this.#tripRouteContainer.querySelector(this.#pointsList.pointsListSelector);
    for (const point of this.#tripPoints) {
      this.#renderPoint(point);
    }
  }

  /**
   * @param {Object} pointItem
   */
  #renderPoint = (pointItem) => {
    const pointPresenter = new PointPresenter(this.#tripPointsContainer);
    pointPresenter.init(pointItem);
  }
}

export {TripRoutePresenter};
