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
      url: `points/${point.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  #adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      id: String(point.backendId),
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

    delete adaptedPoint['id'];
    delete adaptedPoint['basePrice'];
    delete adaptedPoint['dateFrom'];
    delete adaptedPoint['dateTo'];
    delete adaptedPoint['isFavorite'];
    delete adaptedPoint['destinationInfo'];

    return adaptedPoint;
  }
}

export {PointApiService};
