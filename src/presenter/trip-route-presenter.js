import {AddPointPresenter} from './add-point-presenter.js';
import {EmptyPointsListMessage} from '../view/empty-points-list-message.js';
import {filter} from '../utils/filter.js';
import {PointsList} from '../view/points-list.js';
import {PointPresenter} from './point-presenter.js';
import {removeElement, renderElement} from '../utils/manipulate-dom-element.js';
import {Sort} from '../view/sort.js';
import {
  DEFAULT_SORT_TYPE,
  emptyPointsListMessageTypes,
  FilterType,
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
  #addPointPresenter = null;
  #currentSortType = DEFAULT_SORT_TYPE;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #pointsModel = null;
  #tripRouteContainer = null;

  #emptyPointsListMessage = null;
  #pointsList = new PointsList();
  #sort = null;
  #tripPointsPresenter = new Map();

  constructor(tripRouteContainer, pointsModel, filterModel) {
    this.#tripRouteContainer = tripRouteContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#addPointPresenter = new AddPointPresenter(this.#pointsList, this.#handleViewAction);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY_DESC:
        filteredPoints.sort(sortPointsByDateDesc);
        break;
      case SortType.TIME_DESC:
        filteredPoints.sort(sortPointsByTimeDesc);
        break;
      case SortType.PRICE_DESC:
        filteredPoints.sort(sortPointsByPriceDesc);
        break;
      default:
        filteredPoints.sort(sortPointsByDateDesc);
    }
    return filteredPoints;
  }

  init = () => {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderTripRoute();
  }

  destroy = () => {
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#clearTripRoute(true);
  }

  #renderTripRoute = () => {
    if (!this.points.length) {
      this.#renderEmptyTripRoute();
    } else {
      this.#clearEmptyTripRoute();
      this.#renderSort();
      this.#renderTripPoints();
    }
  }

  #clearTripRoute = (resetSortType = false) => {
    this.#addPointPresenter.destroy();

    if (!this.points.length) {
      this.#clearEmptyTripRoute();
    } else {
      this.#clearSort();
      this.#clearTripPoints();
    }

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #renderEmptyTripRoute = () => {
    this.#emptyPointsListMessage = new EmptyPointsListMessage(emptyPointsListMessageTypes[this.#filterModel.filter]);
    renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);
  }

  #clearEmptyTripRoute = () => {
    if (this.#emptyPointsListMessage) {
      removeElement(this.#emptyPointsListMessage);
    }
  }

  #renderSort = () => {
    this.#sort = new Sort(this.#currentSortType);
    renderElement(this.#tripRouteContainer, this.#sort);
    this.#sort.setSortTypeChange(this.#handleSortChange);
  }

  #clearSort = () => {
    removeElement(this.#sort);
  }

  #renderTripPoints = () => {
    renderElement(this.#tripRouteContainer, this.#pointsList);
    for (const point of this.points) {
      this.#renderPoint(point);
    }
  }

  #clearTripPoints = () => {
    removeElement(this.#pointsList);
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
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
    this.#addPointPresenter.destroy();
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
        this.#tripPointsPresenter.get(updatedData.id).init(updatedData);
        break;
      case ViewUpdateType.MINOR:
        this.#clearTripRoute();
        this.#renderTripRoute();
        break;
      case ViewUpdateType.MAJOR:
        this.#clearTripRoute(true);
        this.#renderTripRoute();
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

  addPoint() {
    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filterModel.setFilter(ViewUpdateType.MAJOR, FilterType.EVERYTHING);
    this.#addPointPresenter.init();
  }
}

export {TripRoutePresenter};
