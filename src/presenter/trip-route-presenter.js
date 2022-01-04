import {EmptyPointsListMessage} from '../view/empty-points-list-message.js';
import {PointsList} from '../view/points-list.js';
import {PointPresenter} from './point-presenter.js';
import {removeElement, renderElement} from '../utils/manipulate-dom-element.js';
import {Sort} from '../view/sort.js';
import {
  DEFAULT_SORT_TYPE,
  SortType,
  UserActionType,
  ViewUpdateType,
} from '../const.js';
import {
  sortPointsByDateDesc,
  sortPointsByPriceDesc,
  sortPointsByTimeDesc,
} from '../utils/sort-points.js';

class TripRoutePresenter {
  #currentSortType = DEFAULT_SORT_TYPE;
  #pointsModel = null;
  #tripRouteContainer = null;

  #emptyPointsListMessage = new EmptyPointsListMessage();
  #pointsList = new PointsList();
  #sort = null;
  #tripPointsPresenter = new Map();

  constructor(tripRouteContainer, pointsModel) {
    this.#tripRouteContainer = tripRouteContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY_DESC:
        this.#pointsModel.points.sort(sortPointsByDateDesc);
        break;
      case SortType.TIME_DESC:
        this.#pointsModel.points.sort(sortPointsByTimeDesc);
        break;
      case SortType.PRICE_DESC:
        this.#pointsModel.points.sort(sortPointsByPriceDesc);
        break;
      default:
        this.#pointsModel.points.sort(sortPointsByDateDesc);
    }
    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderTripRoute();
  }

  #clearTripPoints = () => {
    removeElement(this.#pointsList);
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
  }

  #renderEmptyTripRoute = () => renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);

  #renderTripRoute = () => {
    if (!this.points.length) {
      this.#renderEmptyTripRoute();
    } else {
      this.#renderSort();
      this.#renderTripPoints();
    }
  }

  #clearSort = () => {
    removeElement(this.#sort);
  }

  #renderSort = () => {
    this.#sort = new Sort(this.#currentSortType);
    renderElement(this.#tripRouteContainer, this.#sort);
    this.#sort.setSortTypeChange(this.#handleSortChange);
  }

  #renderTripPoints = () => {
    renderElement(this.#tripRouteContainer, this.#pointsList);
    for (const point of this.points) {
      this.#renderPoint(point);
    }
  }

  /**
   * @param {Object} pointItem
   */
  #renderPoint = (pointItem) => {
    const pointPresenter = new PointPresenter(this.#pointsList, this.#handleViewAction, this.#handleModeUpdate);
    pointPresenter.init(pointItem);
    this.#tripPointsPresenter.set(pointItem.id, pointPresenter);
  }

  #handleModeUpdate = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (userActionType, viewUpdateType, updatePoint) => {
    switch (userActionType) {
      case UserActionType.ADD_POINT:
        this.#pointsModel.addPoint(viewUpdateType, updatePoint);
        break;
      case UserActionType.UPDATE_POINT:
        this.#pointsModel.updatePoint(viewUpdateType, updatePoint);
        break;
      case UserActionType.DELETE_POINT:
        this.#pointsModel.deletePoint(viewUpdateType, updatePoint);
        break;
    }
  }

  #handleModelEvent = (viewUpdateType, updatedData) => {
    switch (viewUpdateType) {
      case ViewUpdateType.PATCH:
        //при обновлении задачи
        this.#tripPointsPresenter.get(updatedData.id).init(updatedData);
        break;
      case ViewUpdateType.MINOR:
        //обновить список (при удалении, добавлении)
        break;
      case ViewUpdateType.MAJOR:
        //обновить всю страницу (при смене фильтра)
        break;
    }
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearSort();
    this.#renderSort();

    this.#clearTripPoints();
    this.#renderTripPoints();
  }
}

export {TripRoutePresenter};
