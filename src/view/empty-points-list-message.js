import {AbstractView} from './abstract-view.js';

const createEmptyPointsListMessageTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>`
);

class EmptyPointsListMessage extends AbstractView {
  #message = null

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyPointsListMessageTemplate(this.#message);
  }
}

export {EmptyPointsListMessage};
