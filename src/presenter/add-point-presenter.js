import dayjs from 'dayjs';
import {
  DATE_RANGE_MINUTES_GAP_MIN,
  UserActionType,
  ViewUpdateType,
} from '../const.js';
import {EditPoint} from '../view/edit-point.js';
import {isEscapeEvent} from '../utils/detect-event.js';
import {
  removeElement,
  renderElement,
  RenderPosition,
} from '../utils/manipulate-dom-element.js';

const DEFAULT_POINT_TYPE = 'taxi';

const BLANK_POINT = {
  id: 0,
  type: DEFAULT_POINT_TYPE,
  destination: null,
  offers: null,
  destinationInfo: null,
  basePrice: 1,
  dateFrom: dayjs(),
  dateTo: dayjs().add(DATE_RANGE_MINUTES_GAP_MIN, 'minute'),
  isFavorite: false,
};

class AddPointPresenter {
  #pointsContainer = null;
  #pointEditListItem = null;
  #pointUpdateHandler = null;

  #offersModel = null;
  #destinations = null;
  #destinationsModel = null;

  constructor(pointsContainer, pointUpdateHandler, offersModel, destinationsModel) {
    this.#pointsContainer = pointsContainer;
    this.#pointUpdateHandler = pointUpdateHandler;

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#destinations = this.#destinationsModel.destinations;
  }

  #getBlankPoint = () => {
    if (!this.#destinations) {
      return BLANK_POINT;
    }
    const firstDestination = this.#destinations.find((element, index) => index === 0);
    return {
      ...BLANK_POINT,
      destination: firstDestination.name,
      destinationInfo: {
        description: firstDestination.description,
        pictures: firstDestination.pictures,
      }
    };
  }

  init = () => {
    if (this.#pointEditListItem !== null) {
      return;
    }

    this.#pointEditListItem = new EditPoint(this.#getBlankPoint(), this.#offersModel, this.#destinationsModel);
    this.#pointEditListItem.setSaveClickHandler(this.#handleSaveClick);
    this.#pointEditListItem.setCancelClickHandler(this.#handleCancelClick);

    renderElement(this.#pointsContainer, this.#pointEditListItem, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  }

  destroy = () => {
    if (this.#pointEditListItem === null) {
      return;
    }

    removeElement(this.#pointEditListItem);
    this.#pointEditListItem = null;

    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  }

  #onEscapeKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  setSaving = () => {
    this.#pointEditListItem.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditListItem.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditListItem.shake(resetFormState);
  }

  #handleSaveClick = (point) => {
    this.#pointUpdateHandler(
      UserActionType.ADD_POINT,
      ViewUpdateType.MAJOR,
      {id: 0, ...point}
    );
  }

  #handleCancelClick = () => {
    this.destroy();
  }
}

export {AddPointPresenter};
