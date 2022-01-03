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

export {
  DEFAULT_SORT_TYPE,
  pointTypes,
  SortType,
};
