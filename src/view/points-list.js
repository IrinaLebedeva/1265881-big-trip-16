import {createElement} from '../render.js';

const createPointsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class PointsList {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createPointsListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

export {PointsList};
