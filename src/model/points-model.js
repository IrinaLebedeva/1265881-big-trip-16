import {AbstractObservable} from '../utils/abstract-observable.js';

class PointsModel extends AbstractObservable {
  #points = [];

  set points(points) {
    this.#points = [...points];
  }

  get points() {
    return this.#points;
  }

  updatePoint = (updateType, updatePoint) => {
    const updateElementIndex = this.#points.findIndex((item) => item.id === updatePoint.id);

    if (updateElementIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, updateElementIndex),
      updatePoint,
      ...this.#points.slice(updateElementIndex + 1)
    ];

    this._notify(updateType, updatePoint);
  };

  addPoint = (updateType, addPoint) => {
    this.#points = [
      addPoint,
      ...this.#points,
    ];

    this._notify(updateType, addPoint);
  }

  deletePoint = (updateType, deletePoint) => {
    const index = this.#points.findIndex((task) => task.id === deletePoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}

export {PointsModel};
