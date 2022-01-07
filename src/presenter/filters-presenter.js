import {Filters} from '../view/filters.js';
import {
  FilterType,
  ViewUpdateType
} from '../const.js';
import {
  removeElement,
  renderElement,
  replaceElement
} from '../utils/manipulate-dom-element.js';

class FiltersPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filtersModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new Filters(this.#filtersModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      renderElement(this.#filterContainer, this.#filterComponent);
      return;
    }

    replaceElement(this.#filterComponent, prevFilterComponent);
    removeElement(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(ViewUpdateType.MAJOR, filterType);
  }

  destroy = () => {
    removeElement(this.#filterComponent);
    this.#filterComponent = null;

    this.#filtersModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);

    this.#filtersModel.setFilter(ViewUpdateType.MAJOR, FilterType.EVERYTHING);
  }
}

export {FiltersPresenter};
