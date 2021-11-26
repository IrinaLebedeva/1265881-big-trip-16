/**
 * @param {String} itemContent
 * @returns {String}
 */
const createPointsListItemTemplate = (itemContent) => (
  `<li class="trip-events__item">
    ${itemContent}
  </li>`
);

export {createPointsListItemTemplate};
