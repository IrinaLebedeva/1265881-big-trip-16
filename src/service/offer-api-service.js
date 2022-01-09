import {ApiService} from './api-service.js';

class OfferApiService extends ApiService {
  get offers() {
    return this.load({url: 'offers'})
      .then(ApiService.parseResponse);
  }
}

export {OfferApiService};
