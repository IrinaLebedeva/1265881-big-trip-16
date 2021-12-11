import {EditPoint} from '../view/edit-point.js';
import {isEscapeEvent} from '../utils/detect-event.js';
import {Point} from '../view/point.js';
import {PointsListItem} from '../view/points-list-item.js';
import {
  removeElement,
  renderElement,
  replaceElement
} from '../utils/manipulate-dom-element.js';

class PointPresenter {
  #pointContainer = null;
  #point = null;
  #pointListItem = null;
  #editPoint = null;
  #pointEditListItem = null;

  constructor(pointContainer) {
    this.#pointContainer = pointContainer;
  }

  /**
   * @param {Object} pointItem
   */
  init(pointItem) {
    this.#point = new Point(pointItem);
    this.#pointListItem = new PointsListItem(this.#point.template);
    this.#editPoint = new EditPoint(pointItem);
    this.#pointEditListItem = new PointsListItem(this.#editPoint.template);

    this.#pointListItem.setRollupButtonClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#pointEditListItem.setSaveClickHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#pointEditListItem.setRollupButtonClickHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#pointEditListItem.setDeleteButtonClickHandler(() => {
      this.#removeEditPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    renderElement(this.#pointContainer, this.#pointListItem);
  }

  #replacePointToForm = () => {
    replaceElement(this.#pointEditListItem, this.#pointListItem);
  }

  #replaceFormToPoint = () => {
    replaceElement(this.#pointListItem, this.#pointEditListItem);
  }

  #onEscapeKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }
  }

  #removeEditPoint = () => {
    removeElement(this.#pointEditListItem);
  }
}

export {PointPresenter};
