import {createElement} from '../utils/manipulate-dom-element.js';

/**
 * @abstract
 */
class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate an Abstract class');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  /**
   * @abstract
   */
  get template() {
    throw new Error('Get template method is not implemented in an Abstract class');
  }

  removeElement() {
    this.#element = null;
  }
}

export {AbstractView};
