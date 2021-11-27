import {shuffleArray} from './shuffle-array.js';

const getRandomElementFromArray = (elements) => {
  const shuffledElemens = shuffleArray(elements);
  return shuffledElemens[0];
};

export {getRandomElementFromArray};
