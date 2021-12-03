import {createElement} from '../render.js';

/**
 * @param {String} itemContent
 * @returns {String}
 */
const createPointsListItemTemplate = (itemContent) => (
  `<li class="trip-events__item">
    ${itemContent}
  </li>`
);

class PointsListItem {
  #element = null;
  #item = null;

  constructor(item) {
    this.#item = item;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createPointsListItemTemplate(this.#item);
  }

  removeElement() {
    this.#element = null;
  }
}

export {PointsListItem};
