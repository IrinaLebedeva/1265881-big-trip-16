import {AbstractObservable} from '../utils/abstract-observable.js';
import {ViewUpdateType} from '../const.js';

class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = points.map((point, index) => this.#adaptToClient(point, index));
    } catch (err) {
      this.#points = [];
    }
    this._notify(ViewUpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  updatePoint = async (updateType, updatedPoint) => {
    const updateElementIndex = this.#points.findIndex((item) => item.id === updatedPoint.id);

    if (updateElementIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const updatedPointFromServer = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, updateElementIndex),
        updatedPointFromServer,
        ...this.#points.slice(updateElementIndex + 1)
      ];

      this._notify(updateType, updatedPointFromServer);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (updateType, addedPoint) => {
    try {
      const response = await this.#apiService.addPoint(addedPoint);
      const addedPointFromServer = this.#adaptToClient(response);

      this.#points = [
        addedPointFromServer,
        ...this.#points,
      ];

      this._notify(updateType, addedPointFromServer);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  deletePoint = async (updateType, deletedPoint) => {
    const index = this.#points.findIndex((task) => task.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(deletedPoint);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient = (point) => {
    let destinationInfo = {};
    if (point['destination']['description'] !== null) {
      destinationInfo.description = point['destination']['description'];
    }
    if (point['destination']['pictures'] !== null) {
      destinationInfo.pictures = point['destination']['pictures'];
    }
    if (!Object.keys(destinationInfo).length) {
      destinationInfo = null;
    }

    const adaptedPoint = {
      ...point,
      id: Number(point['id']) + 1,
      backendId: point['id'],
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
      destinationInfo,
      destination: point['destination']['name'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}

export {PointsModel};
