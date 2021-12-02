import {EditPoint} from './view/edit-point.js';
import {Filters} from './view/filters.js';
import {generatePoint} from './mock/point.js';
import {HeaderMenu} from './view/header-menu.js';
import {isEscapeEvent} from './utils/detect-event.js';
import {PointsList} from './view/points-list.js';
import {PointsListItem} from './view/points-list-item.js';
import {Point} from './view/point.js';
import {renderElement} from './render.js';
import {Sort} from './view/sort.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT).fill(null).map((_, index) => generatePoint(index + 1));

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const eventsContainerElement = mainElement.querySelector('.trip-events');

renderElement(navigationContainerElement, new HeaderMenu().element);
renderElement(filtersContainerElement, new Filters().element);
renderElement(eventsContainerElement, new Sort().element);
renderElement(eventsContainerElement, new PointsList().element);
const eventsListElement = eventsContainerElement.querySelector('.trip-events__list');

/**
 * @param {HTMLElement} pointsList
 * @param {Object} pointItem
 */
const renderPoint = (pointsList, pointItem) => {
  const point = new Point(pointItem);
  const pointListItem = new PointsListItem(point.template);
  const editPoint = new EditPoint(pointItem);
  const pointEditListItem = new PointsListItem(editPoint.template);

  const replacePointToForm = () => {
    pointsList.replaceChild(pointEditListItem.element, pointListItem.element);
  };

  const replaceFormToPoint = () => {
    pointsList.replaceChild(pointListItem.element, pointEditListItem.element);
  };

  const onEscapeKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    }
  };

  const removeEditPoint = () => {
    pointsList.removeChild(pointEditListItem.element);
  };

  pointListItem.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscapeKeyDown);
  });

  pointEditListItem.element.querySelector('.event__save-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscapeKeyDown);
  });

  pointEditListItem.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscapeKeyDown);
  });

  pointEditListItem.element.querySelector('.event__reset-btn').addEventListener('click', () => {
    removeEditPoint();
    document.removeEventListener('keydown', onEscapeKeyDown);
  });

  renderElement(pointsList, pointListItem.element);
};

for (const point of points) {
  renderPoint(eventsListElement, point);
}
