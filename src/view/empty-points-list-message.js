import {createElement} from '../render.js';
const MessageTypes = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now',
};

const createEmptyPointsListMessageTemplate = (messageType) => (
  `<p class="trip-events__msg">${messageType}</p>`
);

class EmptyPointsListMessage {
  #element = null;
  #messageType = null

  constructor(messageType = MessageTypes.EVERYTHING) {
    this.#messageType = messageType;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createEmptyPointsListMessageTemplate(this.#messageType);
  }

  removeElement() {
    this.#element = null;
  }
}

export {EmptyPointsListMessage};
