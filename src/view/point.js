import dayjs from 'dayjs';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_VIEW_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

const createOfferTemplate = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`
);

const createOffersListTemplate = (offers) => offers.map((offer) => createOfferTemplate(offer)).join('');

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

const formatNumberInTwoDigits = (number) => (number > 10) ? number :  `0${number}`;

const formatDateDiff = (dateFrom, dateTo) => {
  const diffInMinutes = dayjs(dateTo).diff(dateFrom, 'minute');
  if (diffInMinutes < 60) {
    return `${formatNumberInTwoDigits(diffInMinutes)}M`;
  } else {
    let hours = Math.trunc(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    if (hours < 24) {
      return `${formatNumberInTwoDigits(hours)}H ${formatNumberInTwoDigits(minutes)}M`;
    } else {
      const days = Math.trunc(hours / 24);
      hours = days % 24;
      return `${formatNumberInTwoDigits(days)}D ${formatNumberInTwoDigits(hours)}H ${formatNumberInTwoDigits(minutes)}M`;
    }
  }
};

const createPointTemplate = (point) => {
  const typeIcon = String(point.type).toLowerCase();
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
      <img class="event__type-icon" width="42" height="42" src="img/icons/${typeIcon}.png" alt="">
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

export {createPointTemplate};
