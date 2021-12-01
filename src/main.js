import {renderTemplate, RenderPosition, renderElement} from './render.js';
import {HeaderMenu} from './view/header-menu.js';
import {Filters} from './view/filters.js';
import {Sort} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
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

renderElement(navigationContainerElement, RenderPosition.BEFOREEND, new HeaderMenu().element);
renderElement(filtersContainerElement, RenderPosition.BEFOREEND, new Filters().element);
renderElement(eventsContainerElement, RenderPosition.BEFOREEND, new Sort().element);
renderTemplate(eventsContainerElement, RenderPosition.BEFOREEND, createPointsListTemplate());

const eventsListElement = eventsContainerElement.querySelector('.trip-events__list');

//renderTemplate(eventsListElement, RenderPosition.BEFOREEND, createPointsListItemTemplate(createEditPointTemplate(points[0])));
renderElement(eventsListElement, RenderPosition.BEFOREEND, new PointsListItem(new EditPoint(points[0]).template).element);
for (let i = 1; i < POINTS_COUNT; i++) {
  renderElement(eventsListElement, RenderPosition.BEFOREEND, new PointsListItem(new Point(points[i]).template).element);
}
