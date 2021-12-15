import {AbstractView} from './abstract-view.js';

const createPointsListTemplate = (pointsListClass) => (
  `<ul class="${pointsListClass}">
  </ul>`
);

class PointsList extends AbstractView {
  #POINTS_LIST_CLASS = 'trip-events__list';

  /**
   * @return {String}
   */
  get template() {
    return createPointsListTemplate(this.pointsListClass());
  }

  pointsListClass() {
    return this.#POINTS_LIST_CLASS;
  }

  get pointsListSelector() {
    return `.${this.pointsListClass()}`;
  }
}

export {PointsList};
