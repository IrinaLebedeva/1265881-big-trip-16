import {AbstractView} from './abstract-view.js';
import {SortType} from '../const.js';

const createSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${currentSortType === SortType.DAY_DESC ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day" data-sort-type="${SortType.DAY_DESC}">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSortType === SortType.TIME_DESC ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.TIME_DESC}">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSortType === SortType.PRICE_DESC ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.PRICE_DESC}">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
);

class Sort extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  /**
   * @return {String}
   */
  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChange = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL' || this.element.querySelector(`#${evt.target.getAttribute('for')}`).disabled) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

export {Sort};
