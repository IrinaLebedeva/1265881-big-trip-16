import {AbstractView} from './abstract-view.js';

/**
 * @abstract
 */
class SmartView extends AbstractView {
  _data = {};

  /**
   * @param {Object} update
   * @param {Boolean} isJustDataUpdating
   */
  updateData = (update, isJustDataUpdating = false) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (isJustDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  /**
   * @abstract
   */
  restoreHandlers = () => {
    throw new Error('restoreHandlers method is not implemented in an Abstract class');
  }
}

export {SmartView};
