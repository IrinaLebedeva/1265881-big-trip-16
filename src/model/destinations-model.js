import {AbstractObservable} from '../utils/abstract-observable.js';
import {ServiceLoadUpdateType} from '../const.js';

class DestinationsModel extends AbstractObservable {
  #apiService = null;
  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#apiService.destinations;
      this._notify(ServiceLoadUpdateType.SUCCESS);
    } catch (error) {
      this.#destinations = [];
      this._notify(ServiceLoadUpdateType.ERROR);
    }
  }

  get destinations() {
    return this.#destinations;
  }
}

export {DestinationsModel};
