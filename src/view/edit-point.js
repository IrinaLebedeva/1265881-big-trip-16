import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  DATE_RANGE_MINUTES_GAP_MIN,
  pointTypes
} from '../const.js';
import flatpickr from 'flatpickr';
import {SmartView} from './smart-view.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

dayjs.extend(customParseFormat);

const DAYJS_DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm';
const FLATPICKR_TO_DAYJS_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
const FLATPICKR_DATE_TIME_FORMAT = 'd/m/y H:i';
const PRICE_MIN = 1;

const getOffersByType = (type, availableOffers) => {
  const typeOffers = availableOffers.find((offer) => offer.type === type);
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

const createTownsTemplate = (destinations) => destinations.map((destination) => createTownTemplate(destination.name)).join('');

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
 * @param {Object[]} availableOffers
 * @returns {String}
 */
const createOffersListTemplate = (pointId, type, pointOffers, availableOffers) => {
  const offersByType = getOffersByType(type, availableOffers);
  if (!offersByType) {
    return '';
  }

  return offersByType.map((offer) => createOfferTemplate(pointId, offer, pointOffers)).join('');
};

/**
 * @param {Number} pointId
 * @param {String} type
 * @param {Object[]} offers
 * @param {Object[]} availableOffers
 * @returns {String}
 */
const createOffersTemplate = (pointId, type, offers, availableOffers) => {
  if (!getOffersByType(type, availableOffers)) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOffersListTemplate(pointId, type, offers, availableOffers)}
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
 * @param {Object[]} destinations
 * @param {Object[]} availableOffers
 * @returns {String}
 */
const createEditPointTemplate = (point, destinations, availableOffers) => {
  const {id, type, destination, offers, destinationInfo, basePrice, dateFrom, dateTo} = point;

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
            ${createTownsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dayjs(dateFrom).format(DAYJS_DATE_TIME_FORMAT)}" required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dayjs(dateTo).format(DAYJS_DATE_TIME_FORMAT)}" required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}" required min="${PRICE_MIN}">
        </div>

        ${createActionsTemplate(id)}

      </header>
      <section class="event__details">
        ${createOffersTemplate(id, type, offers, availableOffers)}
        ${createDestinationTemplate(destinationInfo)}
      </section>
    </form>
  </li>`;
};

class EditPoint extends SmartView {
  #dateFromElement = null;
  #dateToElement = null;
  #priceElement = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  _data = null;

  #destinations = null;
  #destinationsModel = null;
  #offers = null;
  #offersModel = null;

  constructor(point, offersModel, destinationsModel) {
    super();
    this._data = point;
    this.#offersModel = offersModel;
    this.#offers = this.#offersModel.offers;
    this.#destinationsModel = destinationsModel;
    this.#destinations = this.#destinationsModel.destinations;

    this.#setInnerElements();

    this.#setInnerHandlers();
    this.#setDatepickers();
  }

  /**
   * @return {String}
   */
  get template() {
    return createEditPointTemplate(this._data, this.#destinations, this.#offers);
  }

  setSaveClickHandler = (callback) => {
    this._callback.saveClick = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#saveHandler);
  }

  #saveHandler = (evt) => {
    evt.preventDefault();
    if (this.#validateForm()) {
      this._callback.saveClick(this.#parseDataToPoint(this._data));
    }
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteButtonClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick();
  }

  setCancelClickHandler = (callback) => {
    this._callback.cancelButtonClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
  }

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancelButtonClick();
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
    this.#setInnerElements();
    this.#setInnerHandlers();
    this.#setDatepickers();

    this.setSaveClickHandler(this._callback.saveClick);
    if (this._data.id) {
      this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
      this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    } else {
      this.setCancelClickHandler(this._callback.cancelButtonClick);
    }
  }

  reset = (point) => {
    this.updateData(point);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeClickHandler);
    this.element.querySelector('input[name=event-destination]').addEventListener('change', this.#destinationChangeHandler);
  }

  #setInnerElements = () => {
    this.#dateFromElement = this.element.querySelector('input[name=event-start-time]');
    this.#dateToElement = this.element.querySelector('input[name=event-end-time]');
    this.#priceElement = this.element.querySelector('input[name=event-price]');
  }

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.#dateFromElement,
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
      this.#dateToElement,
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
    let newDestinationInfo = null;

    const destinationInfo = this.#getDestinationInfoByName(newDestination);
    if (destinationInfo === undefined) {
      newDestination = this._data.destination;
      newDestinationInfo = this._data.destinationInfo;
    } else {
      newDestinationInfo = {
        description: destinationInfo.description,
        pictures: destinationInfo.pictures,
      };
    }

    this.updateData({
      destination: newDestination,
      destinationInfo: newDestinationInfo,
    });
  }

  #getDestinationInfoByName = (newDestination) => this.#destinations.find((destination) => destination.name === newDestination);

  /**
   * @returns {boolean} true, if dates range is valid
   */
  #validateDateRange = () => {
    const dateFrom = dayjs(this.#dateFromElement.value, FLATPICKR_TO_DAYJS_DATE_TIME_FORMAT);
    const dateTo = dayjs(this.#dateToElement.value, FLATPICKR_TO_DAYJS_DATE_TIME_FORMAT);
    const diffInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
    return diffInMinutes >= DATE_RANGE_MINUTES_GAP_MIN;
  }

  /**
   * @returns {boolean} true, if field value is valid
   */
  #validatePrice = () => Boolean(Number(this.#priceElement.value));

  /**
   * @returns {boolean} true, if form fields values are valid
   */
  #validateForm = () => ![
    this.#validateDateRange(),
    this.#validatePrice(),
  ].some((value) => !value);

  #parseDataToPoint = (data) => {
    const point = data;

    const offersByType = getOffersByType(point.type, this.#offers);
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

    point.basePrice = Number(this.#priceElement.value);
    point.dateFrom = dayjs(this.#dateFromElement.value, FLATPICKR_TO_DAYJS_DATE_TIME_FORMAT).toDate();
    point.dateTo = dayjs(this.#dateToElement.value, FLATPICKR_TO_DAYJS_DATE_TIME_FORMAT).toDate();

    point.offers = newPointOffers;
    return point;
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }
}

export {EditPoint};
