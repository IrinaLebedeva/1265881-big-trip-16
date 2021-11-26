import {renderTemplate, RenderPosition} from './render.js';
import {createHeaderMenuTemplate} from './view/header-menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createPointsListItemTemplate} from './view/points-list-item.js';
import {createPointTemplate} from './view/point.js';
import {createEditPointTemplate} from './view/edit-point.js';

const POINTS_COUNT = 3;

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const eventsContainerElement = mainElement.querySelector('.trip-events');

renderTemplate(navigationContainerElement, RenderPosition.BEFOREEND, createHeaderMenuTemplate());
renderTemplate(filtersContainerElement, RenderPosition.BEFOREEND, createFiltersTemplate());
renderTemplate(eventsContainerElement, RenderPosition.BEFOREEND, createSortTemplate());
renderTemplate(eventsContainerElement, RenderPosition.BEFOREEND, createPointsListTemplate());

const eventsListElement = eventsContainerElement.querySelector('.trip-events__list');

renderTemplate(eventsListElement, RenderPosition.BEFOREEND, createPointsListItemTemplate(createEditPointTemplate()));
for (let i = 0; i < POINTS_COUNT; i++) {
  renderTemplate(eventsListElement, RenderPosition.BEFOREEND, createPointsListItemTemplate(createPointTemplate()));
}
