import {AddPointPresenter} from './add-point-presenter.js';
import {EmptyPointsListMessage} from '../view/empty-points-list-message.js';
import {filter} from '../utils/filter.js';
import {PointsList} from '../view/points-list.js';
import {
  PointPresenter,
  State as PointPresenterViewState
} from './point-presenter.js';
import {
  removeElement,
  renderElement,
  RenderPosition,
} from '../utils/manipulate-dom-element.js';
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
  #addPointElement = null;
  #currentSortType = DEFAULT_SORT_TYPE;
  #destinationsModel = null;
  #filtersModel = null;
  #filterType = FilterType.EVERYTHING;
  #offersModel = null;
  #pointsModel = null;
  #tripRouteContainer = null;

  #emptyPointsListMessage = null;
  #pointsList = new PointsList();
  #sort = null;
  #tripPointsPresenter = new Map();

  constructor(tripRouteContainer, pointsModel, filtersModel, offersModel, destinationsModel) {
    this.#tripRouteContainer = tripRouteContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
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
    this.#addPointPresenter = new AddPointPresenter(this.#pointsList, this.#handleViewAction, this.#offersModel, this.#destinationsModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#renderTripRoute();
    this.#renderTripPointsContainer();
  }

  destroy = () => {
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filtersModel.removeObserver(this.#handleModelEvent);

    this.#clearTripRoute(true);
    this.#clearTripPointsContainer();
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
    if (this.#addPointPresenter) {
      this.#addPointPresenter.destroy();
    }

    this.#clearTripPoints();
    this.#clearSort();
    this.#clearEmptyTripRoute();

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #renderEmptyTripRoute = () => {
    this.#emptyPointsListMessage = new EmptyPointsListMessage(emptyPointsListMessageTypes[this.#filtersModel.filter]);
    renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);
  }

  #clearEmptyTripRoute = () => {
    if (this.#emptyPointsListMessage) {
      removeElement(this.#emptyPointsListMessage);
    }
  }

  #renderSort = () => {
    this.#sort = new Sort(this.#currentSortType);
    renderElement(this.#tripRouteContainer, this.#sort, RenderPosition.AFTERBEGIN);
    this.#sort.setSortTypeChange(this.#handleSortChange);
  }

  #clearSort = () => {
    removeElement(this.#sort);
  }

  #renderTripPointsContainer = () => renderElement(this.#tripRouteContainer, this.#pointsList);

  #renderTripPoints = () => {
    for (const point of this.points) {
      this.#renderPoint(point);
    }
  }

  #clearTripPointsContainer = () => removeElement(this.#pointsList);

  #clearTripPoints = () => this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());

  /**
   * @param {Object} pointItem
   */
  #renderPoint = (pointItem) => {
    const pointPresenter = new PointPresenter(
      this.#pointsList,
      this.#handleViewAction,
      this.#handleModeUpdate,
      this.#offersModel,
      this.#destinationsModel
    );
    pointPresenter.init(pointItem);
    this.#tripPointsPresenter.set(pointItem.id, pointPresenter);
  }

  #handleModeUpdate = () => {
    this.#addPointPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (userActionType, viewUpdateType, updatePoint) => {
    switch (userActionType) {
      case UserActionType.ADD_POINT:
        this.#addPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(viewUpdateType, updatePoint);
        } catch (err) {
          this.#addPointPresenter.setAborting();
        }
        break;
      case UserActionType.UPDATE_POINT:
        this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.SAVING);
        try {
          await this.#pointsModel.updatePoint(viewUpdateType, updatePoint);
        } catch (err) {
          this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserActionType.DELETE_POINT:
        this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deletePoint(viewUpdateType, updatePoint);
        } catch (err) {
          this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      default:
        throw new Error(`Invalid userActionType value received ${userActionType}`);
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
      default:
        throw new Error(`Invalid viewUpdateType value received ${viewUpdateType}`);
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

  addPoint(addPointElement) {
    this.#addPointElement = addPointElement;

    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filtersModel.setFilter(ViewUpdateType.MAJOR, FilterType.EVERYTHING);

    this.#addPointElementDisable();
    if (!this.points.length) {
      this.#clearEmptyTripRoute();
    }

    this.#addPointPresenter.init(this.addPointDestroyHandler);
  }

  addPointDestroyHandler = () => {
    if (!this.points.length) {
      this.#renderEmptyTripRoute();
    }
    this.#addPointElementEnable();
  }

  #addPointElementDisable = () => {
    this.#addPointElement.disabled = true;
  }

  #addPointElementEnable = () => {
    this.#addPointElement.disabled = false;
  }
}

export {TripRoutePresenter};
