const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const pointTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const SortType = {
  DAY_DESC: 'day_desc',
  TIME_DESC: 'time_desc',
  PRICE_DESC: 'price_desc',
};

const DEFAULT_SORT_TYPE = SortType.DAY_DESC;

const DATE_RANGE_MINUTES_GAP_MIN = 1;

const UserActionType = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const ViewUpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const ServiceLoadUpdateType = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const emptyPointsListMessageTypes = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const HeaderMenuItems = {
  TRIP_ROUTE: 'TRIP_ROUTE',
  STATISTICS: 'STATISTICS',
};

export {
  ApiMethod,
  DATE_RANGE_MINUTES_GAP_MIN,
  DEFAULT_SORT_TYPE,
  emptyPointsListMessageTypes,
  FilterType,
  HeaderMenuItems,
  pointTypes,
  SortType,
  ServiceLoadUpdateType,
  UserActionType,
  ViewUpdateType
};
