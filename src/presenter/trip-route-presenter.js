import {isEscapeEvent} from '../utils/detect-event.js';
import {EditPoint} from '../view/edit-point.js';
import {EmptyPointsListMessage} from '../view/empty-points-list-message.js';
import {Point} from '../view/point.js';
import {PointsList} from '../view/points-list.js';
import {PointsListItem} from '../view/points-list-item.js';
import {Sort} from '../view/sort.js';
import {
  removeElement,
  renderElement,
  replaceElement,
} from '../utils/manipulate-dom-element.js';

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
    const point = new Point(pointItem);
    const pointListItem = new PointsListItem(point.template);
    const editPoint = new EditPoint(pointItem);
    const pointEditListItem = new PointsListItem(editPoint.template);

    const replacePointToForm = () => {
      replaceElement(pointEditListItem, pointListItem);
    };

    const replaceFormToPoint = () => {
      replaceElement(pointListItem, pointEditListItem);
    };

    const onEscapeKeyDown = (evt) => {
      if (isEscapeEvent(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const removeEditPoint = () => {
      removeElement(pointEditListItem);
    };

    pointListItem.setRollupButtonClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscapeKeyDown);
    });

    pointEditListItem.setSaveClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

    pointEditListItem.setRollupButtonClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

    pointEditListItem.setDeleteButtonClickHandler(() => {
      removeEditPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

    renderElement(this.#tripPointsContainer, pointListItem);
  }
}

export {TripRoutePresenter};
