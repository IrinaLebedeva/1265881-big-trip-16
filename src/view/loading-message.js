import {AbstractView} from './abstract-view';

const loadingMessageTemplate = () => (
  '<p class="trip-events__msg">Loading...</p>'
);

class LoadingMessage extends AbstractView {
  get template() {
    return loadingMessageTemplate();
  }
}

export {LoadingMessage};
