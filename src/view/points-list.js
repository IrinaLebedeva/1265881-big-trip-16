import {AbstractView} from './abstract-view.js';

const createPointsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class PointsList extends AbstractView {
  /**
   * @return {String}
   */
  get template() {
    return createPointsListTemplate();
  }
}

export {PointsList};
