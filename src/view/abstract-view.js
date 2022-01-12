import {createElement} from '../utils/manipulate-dom-element.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

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

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export {AbstractView};
