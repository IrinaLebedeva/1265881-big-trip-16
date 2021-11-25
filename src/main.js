import {renderTemplate, RenderPosition} from './render.js';
import {createHeaderMenuTemplate} from './view/header-menu.js';
import {createFiltersTemplate} from './view/filters.js';

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

renderTemplate(navigationContainerElement, RenderPosition.BEFOREEND, createHeaderMenuTemplate());
renderTemplate(filtersContainerElement, RenderPosition.BEFOREEND, createFiltersTemplate());
