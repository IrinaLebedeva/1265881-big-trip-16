import dayjs from 'dayjs';
import {generateDestinationInfo} from '../mock/destination-info.js';
import {pointTypes} from '../const.js';
import {SmartView} from './smart-view.js';
import {towns} from '../mock/point.js';

const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm';

/**
 * @param {Number} id
 * @param {String} type
 * @param {String} currentType
 * @returns {String}
 */
const createTypeTemplate = (id, type, currentType) => {
  const isChecked = currentType === type ? 'checked' : '';
  return `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
    </div>`;
};

/**
 * @param {Number} id
 * @param {String} currentType
 * @returns {String}
 */
const createTypesTemplate = (id, currentType) => pointTypes.map((type) => createTypeTemplate(id, type, currentType)).join('');

/**
 * @param {String} town
 * @returns {String}
 */
const createTownTemplate = (town) => `<option value="${town}"></option>`;

const createTownsTemplate = () => towns.map((town) => createTownTemplate(town)).join('');

/**
 * @param {Number} pointId
 * @param {Object} offer
 * @returns {String}
 */
const createOfferTemplate = (pointId, offer) => (
  `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${pointId}" type="checkbox" name="event-offer-luggage" checked>
    <label class="event__offer-label" for="event-offer-luggage-${pointId}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`
);

/**
 * @param {Number} pointId
 * @param {Object[]} offers
 * @returns {String}
 */
const createOffersListTemplate = (pointId, offers) => offers.map((offer) => createOfferTemplate(pointId, offer)).join('');

/**
 * @param {Number} pointId
 * @param {Object[]} offers
 * @returns {String}
 */
const createOffersTemplate = (pointId, offers) => {
  if (!offers) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOffersListTemplate(pointId, offers)}
    </div>
  </section>
  `;
};

/**
 * @param {Object[]} pictures
 * @returns {String}
 */
const createDestinationPicturesTemplate = (pictures) => pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

/**
 * @param {Object} destinationInfo
 * @returns {String}
 */
const createDestinationTemplate = (destinationInfo) => {
  if (!destinationInfo) {
    return '';
  }
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationInfo.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createDestinationPicturesTemplate(destinationInfo.pictures)}
      </div>
    </div>
  </section>`;
};

const createAddPointActionsTemplate = () => (
  `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Cancel</button>`
);

const createEditPointActionsTemplate = () => (
  `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Delete</button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
);

/**
 * @param {Number} id
 * @returns {String}
 */
const createActionsTemplate = (id) => id ? createEditPointActionsTemplate() : createAddPointActionsTemplate();

/**
 * @param {Object} point
 * @returns {String}
 */
const createEditPointTemplate = (point = {}) => {
  const {
    id = 0,
    type = 'taxi',
    destination = '',
    offers = null,
    destinationInfo = null,
    basePrice = 1,
    dateFrom = dayjs().format(DATE_TIME_FORMAT),
    dateTo = dayjs().format(DATE_TIME_FORMAT),
  } = point;

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypesTemplate(id, type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
          ${createTownsTemplate()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dayjs(dateFrom).format(DATE_TIME_FORMAT)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dayjs(dateTo).format(DATE_TIME_FORMAT)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
      </div>

      ${createActionsTemplate(id)}

    </header>
    <section class="event__details">
      ${createOffersTemplate(id, offers)}
      ${createDestinationTemplate(destinationInfo)}
    </section>
  </form>`;
};


class EditPoint extends SmartView {
  #point = null;
  #offers = null;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
    this._data = point;

    this.#setInnerHandlers();
  }

  /**
   * @return {String}
   */
  get template() {
    return createEditPointTemplate(this.#point);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.event__type-label').forEach((currentElement) => {
      currentElement.addEventListener('click', this.#typeClickHandler);
    });

    this.element.querySelector('input[name=event-destination]').addEventListener('change', this.#destinationChangeHandler);
  }

  /**
   * @param {String} type
   * @return {Object[]|null}
   */
  #getOffersByType = (type) => {
    const typeOffers = this.#offers.find((offer) => offer.type === type);
    return (typeof typeOffers !== 'undefined') ? typeOffers.offers : null;
  };

  #typeClickHandler = (evt) => {
    evt.preventDefault();
    //сравнить с предыдущим значением
    //получить новый список офферов this.#getOffersByType
    //перерисовать офферы
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    //сравнить с предыдущим значением
    //получить новые, пока моковые данные
    generateDestinationInfo();
    //перерисовать блок с описанием
  }
}

export {EditPoint};
