import {
  API_AUTHORIZATION,
  API_END_POINT,
} from './config.js';
import {DestinationsModel} from './model/destinations-model.js';
import {DestinationApiService} from './service/destination-api-service.js';
import {FiltersModel} from './model/filters-model.js';
import {FiltersPresenter} from './presenter/filters-presenter.js';
import {HeaderMenu} from './view/header-menu.js';
import {
  HeaderMenuItems,
  ServiceLoadUpdateType,
} from './const.js';
import {LoadingMessage} from './view/loading-message.js';
import {OfferApiService} from './service/offer-api-service.js';
import {OffersModel} from './model/offers-model.js';
import {PointApiService} from './service/point-api-service.js';
import {PointsModel} from './model/points-model.js';
import {removeElement, renderElement} from './utils/manipulate-dom-element.js';
import {ServiceErrorMessage} from './view/service-error-message.js';
import {Statistics} from './view/statistics.js';
import {TripRoutePresenter} from './presenter/trip-route-presenter.js';

const headerElement = document.querySelector('.page-header');
const navigationContainerElement = headerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const bodyContainerElement = mainElement.querySelector('.page-body__container');
const eventsContainerElement = mainElement.querySelector('.trip-events');
const eventAddButtonElement = document.querySelector('.trip-main__event-add-btn');

const lockHeader = () => {
  headerElement.querySelectorAll('a, input, button').forEach((element) => {
    element.disabled = true;
  });
};

const unlockHeader = () => {
  headerElement.querySelectorAll('a, input, button').forEach((element) => {
    element.disabled = false;
  });
};

let isServiceLoadingError = false;
const handleServiceState = (viewUpdateType) => {
  switch (viewUpdateType) {
    case ServiceLoadUpdateType.ERROR:
      isServiceLoadingError = true;
      break;
    case ServiceLoadUpdateType.SUCCESS:
      break;
    default:
      throw new Error(`Invalid viewUpdateType value received ${viewUpdateType}`);
  }
};

const pointsModel = new PointsModel(new PointApiService(API_END_POINT, API_AUTHORIZATION));
const filtersModel = new FiltersModel();
const offersModel = new OffersModel(new OfferApiService(API_END_POINT, API_AUTHORIZATION));
offersModel.addObserver(handleServiceState);
const destinationsModel = new DestinationsModel(new DestinationApiService(API_END_POINT, API_AUTHORIZATION));
destinationsModel.addObserver(handleServiceState);

const tripRoutePresenter = new TripRoutePresenter(eventsContainerElement, pointsModel, filtersModel, offersModel, destinationsModel);
const filtersPresenter = new FiltersPresenter(filtersContainerElement, filtersModel, pointsModel);
const headerMenuComponent = new HeaderMenu();

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

eventAddButtonElement.addEventListener('click', handleAddPointClick);

const loadingMessageComponent = new LoadingMessage();
renderElement(eventsContainerElement, loadingMessageComponent);

const handleServiceLoadingError = () => {
  removeElement(loadingMessageComponent);
  renderElement(bodyContainerElement, new ServiceErrorMessage());
};

renderElement(navigationContainerElement, headerMenuComponent);
filtersPresenter.init();
lockHeader();

destinationsModel.init().finally(() => {
  if (isServiceLoadingError) {
    handleServiceLoadingError();
  } else {
    offersModel.init().finally(() => {
      if (isServiceLoadingError) {
        handleServiceLoadingError();
      } else {
        pointsModel.init().finally(() => {
          unlockHeader();
          removeElement(loadingMessageComponent);
          showTripRouteTab();
        });
      }
    });
  }
});
