import {ApiMethod} from '../const.js';
import {ApiService} from './api-service.js';
import dayjs from 'dayjs';

class PointApiService extends ApiService {
  get points() {
    return this.load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (point) => {
    const response = await this.load({
      url: `points/${point.backendId}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  addPoint = async (point) => {
    const response = await this.load({
      url: 'points',
      method: ApiMethod.POST,
      body: JSON.stringify(this.#adaptToServer(point, true)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  deletePoint = async (point) => await this.load({
    url: `points/${point.backendId}`,
    method: ApiMethod.DELETE,
  });

  #adaptToServer = (point, isNewPoint = false) => {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': dayjs(point.dateFrom).toISOString(),
      'date_to': dayjs(point.dateTo).toISOString(),
      'is_favorite': point.isFavorite,
      destination: {
        name: point.destination,
        description: point.destinationInfo !== null ? point.destinationInfo.description : null,
        pictures: point.destinationInfo !== null ? point.destinationInfo.pictures : null,
      }
    };

    if (!isNewPoint) {
      adaptedPoint.id = String(point.backendId);
      delete adaptedPoint['backendId'];
    } else {
      delete adaptedPoint['id'];
    }

    delete adaptedPoint['basePrice'];
    delete adaptedPoint['dateFrom'];
    delete adaptedPoint['dateTo'];
    delete adaptedPoint['isFavorite'];
    delete adaptedPoint['destinationInfo'];

    return adaptedPoint;
  }
}

export {PointApiService};
