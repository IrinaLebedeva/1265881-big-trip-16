import {renderTemplate, RenderPosition, renderElement} from './render.js';
import {HeaderMenu} from './view/header-menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createPointsListItemTemplate} from './view/points-list-item.js';
import {createPointTemplate} from './view/point.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {generatePoint} from './mock/point.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT).fill(null).map((_, index) => generatePoint(index + 1));

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const eventsContainerElement = mainElement.querySelector('.trip-events');

renderElement(navigationContainerElement, RenderPosition.BEFOREEND, new HeaderMenu().element);
renderTemplate(filtersContainerElement, RenderPosition.BEFOREEND, createFiltersTemplate());
renderTemplate(eventsContainerElement, RenderPosition.BEFOREEND, createSortTemplate());
renderTemplate(eventsContainerElement, RenderPosition.BEFOREEND, createPointsListTemplate());

const eventsListElement = eventsContainerElement.querySelector('.trip-events__list');

renderTemplate(eventsListElement, RenderPosition.BEFOREEND, createPointsListItemTemplate(createEditPointTemplate(points[0])));
for (let i = 1; i < POINTS_COUNT; i++) {
  renderTemplate(eventsListElement, RenderPosition.BEFOREEND, createPointsListItemTemplate(createPointTemplate(points[i])));
}
