import {AbstractView} from './abstract-view.js';
import {FilterType} from '../const';

const createFiltersTemplate = (currentFilterType, filteredPointsCountInfo) => (
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="${FilterType.EVERYTHING}" ${currentFilterType === FilterType.EVERYTHING ? 'checked' : ''}
         ${filteredPointsCountInfo[FilterType.EVERYTHING] === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="${FilterType.FUTURE}" ${currentFilterType === FilterType.FUTURE ? 'checked' : ''}
         ${filteredPointsCountInfo[FilterType.FUTURE] === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="${FilterType.PAST}" ${currentFilterType === FilterType.PAST ? 'checked' : ''}
        ${filteredPointsCountInfo[FilterType.PAST] === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class Filters extends AbstractView {
  #currentFilterType = null;
  #filteredPointsCountInfo = null;

  constructor(currentFilterType, filteredPointsCountInfo) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#filteredPointsCountInfo = filteredPointsCountInfo;
  }

  /**
   * @return {String}
   */
  get template() {
    return createFiltersTemplate(this.#currentFilterType, this.#filteredPointsCountInfo);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}

export {Filters};
