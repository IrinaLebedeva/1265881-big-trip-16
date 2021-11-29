import {getRandomInteger} from '../utils/get-random-integer.js';
import {shuffleArray} from '../utils/shuffle-array.js';

const titles = [
  'Upgrade to a business class',
  'Choose the radio station',
  'Add luggage',
  'Switch to comfort',
  'Add meal',
  'Choose seats',
  'Add pets',
];
const OFFERS_COUNT_MIN = 0;
const OFFERS_COUNT_MAX = 5;
const PRICE_MIN = 1;
const PRICE_MAX = 99;

const shuffledTitles = shuffleArray(titles);

const generateTitle = (index) => shuffledTitles[index];
const generatePrice = () => getRandomInteger(PRICE_MIN, PRICE_MAX);

const getOffer = (index) => ({
  id: index + 1,
  title: generateTitle(index),
  price: generatePrice()
});

const generateOffers = () => {
  const offersCount = getRandomInteger(OFFERS_COUNT_MIN, OFFERS_COUNT_MAX);
  return (!offersCount) ? null : Array(offersCount).fill(null).map((_, i) => getOffer(i));
};

export {generateOffers};
