import {RenderPosition, render} from './render.js';
import {HeaderMenu} from './view/header-menu.js';
import {Filters} from './view/filters.js';
import {Sort} from './view/sort.js';
import {PointsList} from './view/points-list.js';
import {PointsListItem} from './view/points-list-item.js';
import {Point} from './view/point.js';
import {EditPoint} from './view/edit-point.js';
import {generatePoint} from './mock/point.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT).fill(null).map((_, index) => generatePoint(index + 1));

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const eventsContainerElement = mainElement.querySelector('.trip-events');

render(navigationContainerElement, RenderPosition.BEFOREEND, new HeaderMenu().element);
render(filtersContainerElement, RenderPosition.BEFOREEND, new Filters().element);
render(eventsContainerElement, RenderPosition.BEFOREEND, new Sort().element);
render(eventsContainerElement, RenderPosition.BEFOREEND, new PointsList().element);
const eventsListElement = eventsContainerElement.querySelector('.trip-events__list');

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

  const removeEditPoint = () => {
    pointsList.removeChild(pointEditListItem.element);
  };

  pointListItem.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
  });

  pointEditListItem.element.querySelector('.event__save-btn').addEventListener('click', () => {
    replaceFormToPoint();
  });

  pointEditListItem.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
  });

  pointEditListItem.element.querySelector('.event__reset-btn').addEventListener('click', () => {
    removeEditPoint();
  });

  render(pointsList, RenderPosition.BEFOREEND, pointListItem.element);
};

for (const point of points) {
  renderPoint(eventsListElement, point);
}
