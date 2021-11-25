import {renderTemplate, RenderPosition} from './render.js';
import {createHeaderMenuTemplate} from './view/header-menu.js';

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');

renderTemplate(navigationContainerElement, RenderPosition.BEFOREEND, createHeaderMenuTemplate());

