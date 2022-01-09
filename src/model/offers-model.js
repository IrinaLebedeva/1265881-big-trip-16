import {AbstractObservable} from '../utils/abstract-observable.js';
import {ServiceLoadUpdateType} from '../const.js';

class OffersModel extends AbstractObservable {
  #apiService = null;
  #offers = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#apiService.offers;
      this._notify(ServiceLoadUpdateType.SUCCESS);
    } catch (error) {
      this.#offers = [];
      this._notify(ServiceLoadUpdateType.ERROR);
    }
  }

  get offers() {
    return this.#offers;
  }
}

export {OffersModel};
