import {AbstractView} from './abstract-view.js';

const MessageTypes = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now',
};

const createEmptyPointsListMessageTemplate = (messageType) => (
  `<p class="trip-events__msg">${messageType}</p>`
);

class EmptyPointsListMessage extends AbstractView {
  #messageType = null

  constructor(messageType = MessageTypes.EVERYTHING) {
    super();
    this.#messageType = messageType;
  }

  get template() {
    return createEmptyPointsListMessageTemplate(this.#messageType);
  }
}

export {EmptyPointsListMessage};
