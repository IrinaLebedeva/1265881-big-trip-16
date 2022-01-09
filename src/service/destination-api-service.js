import {ApiService} from './api-service.js';

class DestinationApiService extends ApiService {
  get destinations() {
    return this.load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }
}

export {DestinationApiService};
