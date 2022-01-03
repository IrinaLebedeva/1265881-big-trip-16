import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import {generateDestinationInfo} from '../mock/destination-info.js';
import {offersByPointTypes} from '../mock/offer.js';
import {pointTypes} from '../const.js';
import {SmartView} from './smart-view.js';
import {towns} from '../mock/point.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const DAYJS_DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm';
const FLATPICKR_DATE_TIME_FORMAT = 'd/m/y H:i';

const getOffersByType = (type) => {
  const typeOffers = offersByPointTypes.find((offer) => offer.type === type);
  return (typeof typeOffers !== 'undefined') ? typeOffers.offers : null;
};

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
 * @param {Object[]} pointOffers
 * @returns {String}
 */
const createOfferTemplate = (pointId, offer, pointOffers) => {
  let isSelectedPointOffer = false;
  if (pointOffers) {
    pointOffers.forEach((pointOffer) => {
      if (offer.id === pointOffer.id) {
        isSelectedPointOffer = true;
      }
    });
  }
  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${pointId}-${offer.id}" value="${offer.id}" type="checkbox" name="event-offer" ${isSelectedPointOffer ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${pointId}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
};

/**
 * @param {Number} pointId
 * @param {String} type
 * @param {Object[]} pointOffers
 * @returns {String}
 */
const createOffersListTemplate = (pointId, type, pointOffers) => {
  const offersByType = getOffersByType(type);
  if (!offersByType) {
    return '';
  }

  return offersByType.map((offer) => createOfferTemplate(pointId, offer, pointOffers)).join('');
};

/**
 * @param {Number} pointId
 * @param {String} type
 * @param {Object[]} offers
 * @returns {String}
 */
const createOffersTemplate = (pointId, type, offers) => {
  if (!getOffersByType(type)) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOffersListTemplate(pointId, type, offers)}
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
    dateFrom = dayjs().format(DAYJS_DATE_TIME_FORMAT),
    dateTo = dayjs().format(DAYJS_DATE_TIME_FORMAT),
  } = point;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
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
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dayjs(dateFrom).format(DAYJS_DATE_TIME_FORMAT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dayjs(dateTo).format(DAYJS_DATE_TIME_FORMAT)}">
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
        ${createOffersTemplate(id, type, offers)}
        ${createDestinationTemplate(destinationInfo)}
      </section>
    </form>
  </li>`;
};

class EditPoint extends SmartView {
  #datepickerFrom = null;
  #datepickerTo = null;
  _data = null;

  constructor(point) {
    super();
    this._data = point;

    this.#setInnerHandlers();
    this.#setDatepickers();
  }

  /**
   * @return {String}
   */
  get template() {
    return createEditPointTemplate(this._data);
  }

  setSaveClickHandler = (callback) => {
    this._callback.saveClick = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#saveHandler);
  }

  #saveHandler = (evt) => {
    evt.preventDefault();
    this._callback.saveClick(this.#parseDataToPoint(this._data));
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteButtonClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick();
  }

  setRollupButtonClickHandler = (callback) => {
    this._callback.rollupButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickers();

    this.setSaveClickHandler(this._callback.saveClick);
    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
  }

  reset = (point) => {
    this.updateData(point);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeClickHandler);
    this.element.querySelector('input[name=event-destination]').addEventListener('change', this.#destinationChangeHandler);
  }

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        dateFormat: FLATPICKR_DATE_TIME_FORMAT,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        enableTime: true,
        minuteIncrement: 1,
        defaultDate: dayjs(this._data.dateFrom).toISOString(),
      }
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        dateFormat: FLATPICKR_DATE_TIME_FORMAT,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        enableTime: true,
        minuteIncrement: 1,
        defaultDate: dayjs(this._data.dateTo).toISOString(),
      }
    );
  }

  #typeClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    const newType = this.element.querySelector(`#${evt.target.getAttribute('for')}`).value;
    this.updateData({
      type: newType,
      offers: null,
    });
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    let newDestination = this.element.querySelector('input[name=event-destination]').value.trim();
    let newDestinationInfo = generateDestinationInfo();

    if (!this.#isValidDestination(newDestination)) {
      newDestination = this._data.destination;
      newDestinationInfo = this._data.destinationInfo;
    }

    this.updateData({
      destination: newDestination,
      destinationInfo: newDestinationInfo,
    });
  }

  #isValidDestination = (newDestination) => towns.find((town) => town === newDestination) !== undefined;

  #parseDataToPoint = (data) => {
    const point = data;

    const offersByType = getOffersByType(point.type);
    const selectedOffers = [];
    this.element.querySelectorAll('input[name=event-offer]:checked').forEach((element) => selectedOffers.push(element.value));

    const newPointOffers = [];
    if (selectedOffers.length) {
      offersByType.forEach((offer) => {
        const pointOffer = selectedOffers.find((selectedOffer) => Number(selectedOffer) === Number(offer.id));
        if (pointOffer !== undefined) {
          newPointOffers.push(offer);
        }
      });
    }

    point.offers = newPointOffers;
    return point;
  }

  removeElement = () => {
    super.removeElement();

    this.#datepickerFrom.destroy();
    this.#datepickerFrom = null;

    this.#datepickerTo.destroy();
    this.#datepickerTo = null;
  }
}

export {EditPoint};
