import {shuffleArray} from './shuffle-array.js';

const getRandomElementFromArray = (elements) => {
  const shuffledElements = shuffleArray(elements);
  return shuffledElements[0];
};

export {getRandomElementFromArray};
