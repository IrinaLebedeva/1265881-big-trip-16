import {EditPoint} from '../view/edit-point.js';
import {isEscapeEvent} from '../utils/detect-event.js';
import {Point} from '../view/point.js';
import {PointsListItem} from '../view/points-list-item.js';
import {
  removeElement,
  renderElement,
  replaceElement
} from '../utils/manipulate-dom-element.js';

const Mode = {
  DEFAULT: 'VIEW',
  EDIT: 'EDIT',
};

class PointPresenter {
  #editPoint = null;
  #mode = Mode.DEFAULT;
  #modeUpdateHandler = null;
  #pointsContainer = null;
  #point = null;
  #pointItem = null;
  #pointListItem = null;
  #pointEditListItem = null;
  #pointUpdateHandler = null;
  #previousPointListItem = null;
  #previousPointEditListItem = null;

  constructor(pointsContainer, pointUpdateHandler, modeUpdateHandler) {
    this.#pointsContainer = pointsContainer;
    this.#pointUpdateHandler = pointUpdateHandler;
    this.#modeUpdateHandler = modeUpdateHandler;
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
    });

    this.#pointListItem.setFavouriteClickHandler(this.#handleFavouriteClick);

    this.#pointEditListItem.setSaveClickHandler(() => {
      this.#replaceFormToPoint();
    });

    this.#pointEditListItem.setRollupButtonClickHandler(() => {
      this.#replaceFormToPoint();
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

  resetView = () => {
    if (this.#mode === Mode.EDIT) {
      this.#replaceFormToPoint();
    }
  }

  destroy = () => {
    removeElement(this.#pointListItem);
    removeElement(this.#pointEditListItem);
  }

  #reInit = () => {
    if (this.#mode === Mode.DEFAULT) {
      replaceElement(this.#pointListItem, this.#previousPointListItem);
    }
    if (this.#mode === Mode.EDIT) {
      replaceElement(this.#pointEditListItem, this.#previousPointEditListItem);
    }

    removeElement(this.#previousPointListItem);
    removeElement(this.#previousPointEditListItem);

    this.#previousPointListItem = null;
    this.#previousPointEditListItem = null;
  }

  #replacePointToForm = () => {
    replaceElement(this.#pointEditListItem, this.#pointListItem);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
    this.#modeUpdateHandler();
    this.#mode = Mode.EDIT;
  }

  #replaceFormToPoint = () => {
    replaceElement(this.#pointListItem, this.#pointEditListItem);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
    this.#mode = Mode.DEFAULT;
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
