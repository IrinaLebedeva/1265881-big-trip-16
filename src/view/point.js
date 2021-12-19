import {AbstractView} from './abstract-view.js';
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const DATE_VIEW_FORMAT = 'MMM D';
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const TIME_FORMAT = 'HH:mm';

/**
 * @param {Object} offer
 * @return {string}
 */
const createOfferTemplate = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`
);

/**
 * @param {Object[]} offers
 * @return {string}
 */
const createOffersListTemplate = (offers) => offers.map((offer) => createOfferTemplate(offer)).join('');

/**
 * @param {Object[]} offers
 * @return {string}
 */
const createOffersTemplate = (offers) => {
  if (!offers) {
    return '';
  }
  return `
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${createOffersListTemplate(offers)}
  </ul>`;
};

/**
 * @param {Number} number
 * @returns {String}
 */
const formatNumberInTwoDigits = (number) => (number > 9) ? number :  `0${number}`;

/**
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @returns {`${string}H ${string}M`|`${string}D ${string}H ${string}M`|`${string}M`}
 */
const formatDateDiff = (dateFrom, dateTo) => {
  const diffInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  if (diffInMinutes < MINUTES_IN_HOUR) {
    return `${formatNumberInTwoDigits(diffInMinutes)}M`;
  } else {
    let hours = Math.trunc(diffInMinutes / MINUTES_IN_HOUR);
    const minutes = diffInMinutes % MINUTES_IN_HOUR;
    if (hours < HOURS_IN_DAY) {
      return `${formatNumberInTwoDigits(hours)}H ${formatNumberInTwoDigits(minutes)}M`;
    } else {
      const days = Math.trunc(hours / HOURS_IN_DAY);
      hours = days % HOURS_IN_DAY;
      return `${formatNumberInTwoDigits(days)}D ${formatNumberInTwoDigits(hours)}H ${formatNumberInTwoDigits(minutes)}M`;
    }
  }
};

/**
 * @param {Object} point
 * @returns {String}
 */
const createPointTemplate = (point) => {
  const dateFrom = dayjs(point.dateFrom).format(DATE_FORMAT);
  const dateFromInViewFormat = dayjs(point.dateFrom).format(DATE_VIEW_FORMAT);
  const timeFrom = dayjs(point.dateFrom).format(TIME_FORMAT);
  const timeTo = dayjs(point.dateTo).format(TIME_FORMAT);
  const dateTimeFrom = dayjs(point.dateFrom).format(DATE_TIME_FORMAT);
  const dateTimeTo = dayjs(point.dateTo).format(DATE_TIME_FORMAT);
  const dateDiff = formatDateDiff(point.dateFrom, point.dateTo);
  const isFavoriteClassName = point.isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <div class="event">
    <time class="event__date" datetime="${dateFrom}">${dateFromInViewFormat}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="">
    </div>
    <h3 class="event__title">${point.type} ${point.destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateTimeFrom}">${timeFrom}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateTimeTo}">${timeTo}</time>
      </p>
      <p class="event__duration">${dateDiff}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
    </p>
    ${createOffersTemplate(point.offers)}
    <button class="event__favorite-btn ${isFavoriteClassName}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`;
};

class Point extends AbstractView {
  #point = null

  constructor(point) {
    super();
    this.#point = point;
  }

  /**
   * @return {String}
   */
  get template() {
    return createPointTemplate(this.#point);
  }
}

export {Point};
