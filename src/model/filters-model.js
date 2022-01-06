import {AbstractObservable} from '../utils/abstract-observable.js';
import {FilterType} from '../const.js';

class FiltersModel extends AbstractObservable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}

export {FiltersModel};
