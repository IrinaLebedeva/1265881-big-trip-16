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

  setSaveClickHandler = (callback) => {
    this._callback.saveClick = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#saveHandler);
  }

  #saveHandler = (evt) => {
    evt.preventDefault();
    this._callback.saveClick();
  }

  setRollupButtonClickHandler = (callback) => {
    this._callback.rollupButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteButtonClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick();
  }
}

export {PointsListItem};
