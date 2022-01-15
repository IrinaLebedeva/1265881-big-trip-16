import {AbstractView} from './abstract-view.js';

const createTripInfoTemplate = (tripInfo) => {
  const {
    title,
    dates,
    cost
  } = tripInfo;

  return `<section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${dates}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
};

class TripInfo extends AbstractView {
  #tripInfo = null;

  constructor(tripInfo) {
    super();
    this.#tripInfo = tripInfo;
  }

  /**
   * @return {String}
   */
  get template() {
    return createTripInfoTemplate(this.#tripInfo);
  }
}

export {TripInfo};
