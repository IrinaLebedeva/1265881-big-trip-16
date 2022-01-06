import {AbstractView} from '../view/abstract-view.js';

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * @param {HTMLElement|AbstractView} container
 * @param {HTMLElement|AbstractView} element
 * @param {String} position
 */
const renderElement = (container, element, position = RenderPosition.BEFOREEND) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (position) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
    default:
      parent.append(child);
  }
};

/**
 * @param {String} template
 * @returns {ChildNode}
 */
const createElement = (template) => {
  const container = document.createElement('div');
  container.innerHTML = template;
  return container.firstChild;
};

/**
 * @param {HTMLElement|AbstractView} newElement
 * @param {HTMLElement|AbstractView} oldElement
 */
const replaceElement = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Can\'t find parent element');
  }

  parent.replaceChild(newChild, oldChild);
};

/**
 * @param {HTMLElement|AbstractView} element
 */
const removeElement = (element) => {
  if (element === null) {
    return;
  }

  if (element instanceof AbstractView) {
    element.element.remove();
    element.removeElement();
  } else {
    element.remove();
  }
};

export {
  createElement,
  removeElement,
  renderElement,
  RenderPosition,
  replaceElement,
};
