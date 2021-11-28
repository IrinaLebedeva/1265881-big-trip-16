import {generateOffers} from './offer.js';
import {shuffleArray} from '../utils/shuffle-array.js';
import {getRandomInteger} from '../utils/get-random-integer.js';
import {getRandomElementFromArray} from '../utils/get-random-array-element.js';
import dayjs from 'dayjs';

const types = [
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

const towns = [
  'Geneva',
  'Zurich',
  'Berne',
  'Lugano',
  'Lenzburg',
  'Aarau',
  'Lucerne',
];

const DESCRIPTIONS_COUNT_MIN = 1;
const DESCRIPTIONS_COUNT_MAX = 5;
const DESTINATION_PHOTOS_COUNT_MIN = 1;
const DESTINATION_PHOTOS_COUNT_MAX = 5;
const PHOTOS_URL_TEMPLATE = 'http://picsum.photos/248/152?r=';
const PRICE_MIN = 1;
const PRICE_MAX = 1000;
const DAYS_GAP = 7;
const MINUTES_GAP_MIN = 10;
const MINUTES_GAP_MAX = 24*60*DAYS_GAP;

const generateType = () => getRandomElementFromArray(types);

const generateDestination = () => getRandomElementFromArray(towns);

const getDescriptions = () => {
  const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const descriptions = DESCRIPTION.split('.');
  return descriptions.filter((item) => item.length).map((item) => item.trim());
};

const descriptionsList = getDescriptions();

const generateDescription = () => {
  const shuffledDescriptions = shuffleArray(descriptionsList);
  const description = shuffledDescriptions.slice(0, getRandomInteger(DESCRIPTIONS_COUNT_MIN, DESCRIPTIONS_COUNT_MAX)).join('. ');
  return `${description}.`;
};

const getPicture = () => {
  const shuffledDescriptions = shuffleArray(descriptionsList);
  return {
    src: PHOTOS_URL_TEMPLATE + Math.random(),
    description: shuffledDescriptions[0],
  };
};

const generateDestinationPhotos = () => Array(getRandomInteger(DESTINATION_PHOTOS_COUNT_MIN, DESTINATION_PHOTOS_COUNT_MAX)).fill(null).map(() => getPicture());

const generateDestinationInfo = () => {
  if (!getRandomInteger(0, 1)) {
    return null;
  }

  return ({
    description: generateDescription(),
    pictures: generateDestinationPhotos(),
  });
};

const generatePrice = () => getRandomInteger(PRICE_MIN, PRICE_MAX);

const generateIsFavorite = () => Boolean(getRandomInteger(0, 1));

const generateDateFrom = () => dayjs().add(getRandomInteger(-DAYS_GAP, DAYS_GAP), 'day').toDate();

const generateDateTo = (dateFrom, dateGapInMinutes) => dayjs(dateFrom).add(dateGapInMinutes, 'minute').toDate();

const generatePoint = (id) => {
  const dateFrom = generateDateFrom();
  return {
    id,
    type: generateType(),
    destination: generateDestination(),
    offers: generateOffers(),
    destinationInfo: generateDestinationInfo(),
    basePrice: generatePrice(),
    isFavorite: generateIsFavorite(),
    dateFrom,
    dateTo: generateDateTo(dateFrom, getRandomInteger(MINUTES_GAP_MIN, MINUTES_GAP_MAX)),
  };
};

export {generatePoint, types, towns};
