import {AbstractView} from './abstract-view.js';
import {HeaderMenuItems} from '../const.js';

const createHeaderMenuTemplate = (currentMenuItem) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn ${currentMenuItem === HeaderMenuItems.TRIP_ROUTE ? 'trip-tabs__btn--active' : ''}" href="#" data-menu-item="${HeaderMenuItems.TRIP_ROUTE}">Table</a>
    <a class="trip-tabs__btn ${currentMenuItem === HeaderMenuItems.STATISTICS ? 'trip-tabs__btn--active' : ''}" href="#" data-menu-item="${HeaderMenuItems.STATISTICS}">Stats</a>
  </nav>`
);

class HeaderMenu extends AbstractView {
  #currentMenuItem = null;

  constructor(currentMenuItem = HeaderMenuItems.TRIP_ROUTE) {
    super();

    this.#currentMenuItem = currentMenuItem;
  }

  /**
   * @return {String}
   */
  get template() {
    return createHeaderMenuTemplate(this.#currentMenuItem);
  }

  setMenuItem = (menuItem) => {
    if (typeof HeaderMenuItems[menuItem] === 'undefined') {
      return;
    }

    this.#currentMenuItem = menuItem;
    const menuItemsList = this.element.querySelectorAll('.trip-tabs__btn');

    menuItemsList.forEach((element) => {
      element.classList.remove('trip-tabs__btn--active');
      if (element.dataset.menuItem === this.#currentMenuItem) {
        element.classList.add('trip-tabs__btn--active');
      }
    });
  }

  setHeaderMenuClickHandler = (callback) => {
    this._callback.headerMenuClick = callback;
    this.element.addEventListener('click', this.#headerMenuClickHandler);
  }

  #headerMenuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    const menuItem = evt.target.dataset.menuItem;
    this.setMenuItem(menuItem);
    this._callback.headerMenuClick(evt.target.dataset.menuItem);
  }
}

export {HeaderMenu};
