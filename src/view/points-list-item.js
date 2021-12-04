import {AbstractView} from './abstract-view.js';

/**
 * @param {String} itemContent
 * @returns {String}
 */
const createPointsListItemTemplate = (itemContent) => (
  `<li class="trip-events__item">
    ${itemContent}
  </li>`
);

class PointsListItem extends AbstractView {
  #item = null;

  constructor(item) {
    super();
    this.#item = item;
  }

  /**
   * @return {String}
   */
  get template() {
    return createPointsListItemTemplate(this.#item);
  }
}

export {PointsListItem};
