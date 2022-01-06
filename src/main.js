import {FiltersModel} from './model/filters-model.js';
import {FiltersPresenter} from './presenter/filters-presenter.js';
import {generatePoint} from './mock/point.js';
import {HeaderMenu} from './view/header-menu.js';
import {offersByPointTypes} from './mock/offer.js';
import {PointsModel} from './model/points-model.js';
import {renderElement} from './utils/manipulate-dom-element.js';
import {TripRoutePresenter} from './presenter/trip-route-presenter.js';

const POINTS_COUNT = 5;

const points = Array(POINTS_COUNT).fill(null).map((_, index) => generatePoint(index + 1, offersByPointTypes));
const pointsModel = new PointsModel();
pointsModel.points = points;

const filtersModel = new FiltersModel();

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const eventsContainerElement = mainElement.querySelector('.trip-events');

renderElement(navigationContainerElement, new HeaderMenu());

const tripRoutePresenter = new TripRoutePresenter(eventsContainerElement, pointsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(filtersContainerElement, filtersModel, pointsModel);

tripRoutePresenter.init();
filtersPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.addPoint();
});
