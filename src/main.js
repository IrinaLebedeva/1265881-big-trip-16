import {FiltersModel} from './model/filters-model.js';
import {FiltersPresenter} from './presenter/filters-presenter.js';
import {generatePoint} from './mock/point.js';
import {HeaderMenu} from './view/header-menu.js';
import {HeaderMenuItems} from './const.js';
import {offersByPointTypes} from './mock/offer.js';
import {PointsModel} from './model/points-model.js';
import {removeElement, renderElement} from './utils/manipulate-dom-element.js';
import {Statistics} from './view/statistics.js';
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
const bodyContainerElement = mainElement.querySelector('.page-body__container');
const eventsContainerElement = mainElement.querySelector('.trip-events');

const tripRoutePresenter = new TripRoutePresenter(eventsContainerElement, pointsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(filtersContainerElement, filtersModel, pointsModel);

const headerMenuComponent = new HeaderMenu();
renderElement(navigationContainerElement, headerMenuComponent);

let statisticsComponent = null;

const handleHeaderMenuClick = (headerMenuItem) => {
  switch (headerMenuItem) {
    case HeaderMenuItems.TRIP_ROUTE:
      tripRoutePresenter.destroy();
      tripRoutePresenter.init();
      filtersPresenter.destroy();
      filtersPresenter.init();
      removeElement(statisticsComponent);
      break;
    case HeaderMenuItems.STATISTICS:
      filtersPresenter.destroy();
      tripRoutePresenter.destroy();
      statisticsComponent = new Statistics(pointsModel.points);
      renderElement(bodyContainerElement, statisticsComponent);
      break;
    default:
      tripRoutePresenter.destroy();
      tripRoutePresenter.init();
      filtersPresenter.destroy();
      filtersPresenter.init();
      removeElement(statisticsComponent);
  }
};

headerMenuComponent.setHeaderMenuClickHandler(handleHeaderMenuClick);

const showTripRouteTab = () => {
  headerMenuComponent.setMenuItem(HeaderMenuItems.TRIP_ROUTE);
  handleHeaderMenuClick(HeaderMenuItems.TRIP_ROUTE);
};

const handleAddPointClick = (evt) => {
  evt.preventDefault();
  showTripRouteTab();
  tripRoutePresenter.addPoint();
};

showTripRouteTab();
document.querySelector('.trip-main__event-add-btn').addEventListener('click', handleAddPointClick);
