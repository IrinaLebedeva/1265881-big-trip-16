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
  #editPoint = null;
  #pointsContainer = null;
  #point = null;
  #pointItem = null;
  #pointListItem = null;
  #pointEditListItem = null;
  #pointUpdateHandler = null;
  #previousPointListItem = null;
  #previousPointEditListItem = null;

  constructor(pointsContainer, pointUpdateHandler) {
    this.#pointsContainer = pointsContainer;
    this.#pointUpdateHandler = pointUpdateHandler;
  }

  /**
   * @param {Object} pointItem
   */
  init(pointItem) {
    this.#previousPointListItem = this.#pointListItem;
    this.#previousPointEditListItem = this.#pointEditListItem;

    this.#pointItem = pointItem;
    this.#point = new Point(pointItem);
    this.#pointListItem = new PointsListItem(this.#point.template);
    this.#editPoint = new EditPoint(pointItem);
    this.#pointEditListItem = new PointsListItem(this.#editPoint.template);

    this.#pointListItem.setRollupButtonClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#pointListItem.setFavouriteClickHandler(this.#handleFavouriteClick);

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

    if (this.#previousPointListItem === null || this.#previousPointEditListItem === null) {
      renderElement(this.#pointsContainer, this.#pointListItem);
      return;
    }
    this.#reInit();
  }

  #reInit = () => {
    if (this.#pointsContainer.element.contains(this.#previousPointListItem.element)) {
      replaceElement(this.#pointListItem, this.#previousPointListItem);
    }
    if (this.#pointsContainer.element.contains(this.#previousPointEditListItem.element)) {
      replaceElement(this.#pointEditListItem, this.#previousPointEditListItem);
    }

    removeElement(this.#previousPointListItem);
    removeElement(this.#previousPointEditListItem);

    this.#previousPointListItem = null;
    this.#previousPointEditListItem = null;
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

  #handleFavouriteClick = () => {
    this.#pointUpdateHandler({...this.#pointItem, isFavorite: !this.#pointItem.isFavorite});
  }
}

export {PointPresenter};
