import dayjs from 'dayjs';
import {generateDestinationInfo} from './destination-info.js';
import {getRandomInteger} from '../utils/get-random-integer.js';
import {getRandomElementFromArray} from '../utils/get-random-array-element.js';
import {pointTypes} from '../const.js';

const towns = [
  'Geneva',
  'Zurich',
  'Berne',
  'Lugano',
  'Lenzburg',
  'Aarau',
  'Lucerne',
];

const PRICE_MIN = 1;
const PRICE_MAX = 1000;
const DAYS_GAP = 7;
const MINUTES_GAP_MIN = 10;
const MINUTES_GAP_MAX = 24*60*DAYS_GAP;

/**
 * @param {Object[]} offers
 * @param {String} type
 * @return {Object[]|null}
 */
const getOffersByType = (offers, type) => {
  const typeOffers = offers.find((offer) => offer.type === type);
  return (typeof typeOffers !== 'undefined') ? typeOffers.offers : null;
};

const generateType = () => getRandomElementFromArray(pointTypes);

const generateDestination = () => getRandomElementFromArray(towns);

const generatePrice = () => getRandomInteger(PRICE_MIN, PRICE_MAX);

const generateIsFavorite = () => Boolean(getRandomInteger(0, 1));

const generateDateFrom = () => dayjs().add(getRandomInteger(-DAYS_GAP, DAYS_GAP), 'day').toDate();

const generateDateTo = (dateFrom, dateGapInMinutes) => dayjs(dateFrom).add(dateGapInMinutes, 'minute').toDate();

const generatePoint = (id, offers) => {
  const dateFrom = generateDateFrom();
  const type = generateType();
  return {
    id,
    type,
    destination: generateDestination(),
    offers: getOffersByType(offers, type),
    destinationInfo: generateDestinationInfo(),
    basePrice: generatePrice(),
    isFavorite: generateIsFavorite(),
    dateFrom,
    dateTo: generateDateTo(dateFrom, getRandomInteger(MINUTES_GAP_MIN, MINUTES_GAP_MAX)),
  };
};

export {generatePoint, towns};
