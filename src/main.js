import {renderTemplate, RenderPosition} from './render.js';
import {createHeaderMenuTemplate} from './view/header-menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const eventsContainerElement = mainElement.querySelector('.trip-events');

renderTemplate(navigationContainerElement, RenderPosition.BEFOREEND, createHeaderMenuTemplate());
renderTemplate(filtersContainerElement, RenderPosition.BEFOREEND, createFiltersTemplate());
renderTemplate(eventsContainerElement, RenderPosition.BEFOREEND, createSortTemplate());
