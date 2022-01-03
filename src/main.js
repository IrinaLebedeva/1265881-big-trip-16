import {Filters} from './view/filters.js';
import {generatePoint} from './mock/point.js';
import {HeaderMenu} from './view/header-menu.js';
import {offersByPointTypes} from './mock/offer.js';
import {renderElement} from './utils/manipulate-dom-element.js';
import {TripRoutePresenter} from './presenter/trip-route-presenter.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT).fill(null).map((_, index) => generatePoint(index + 1, offersByPointTypes));

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const eventsContainerElement = mainElement.querySelector('.trip-events');

renderElement(navigationContainerElement, new HeaderMenu());
renderElement(filtersContainerElement, new Filters());

const tripRoutePresenter = new TripRoutePresenter(eventsContainerElement);
tripRoutePresenter.init(points);
