const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderTemplate = (container, position, template) => {
  container.insertAdjacentHTML(position, template);
};

const renderElement = (container, position, element) => {
  switch (position) {
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

const createElement = (template) => {
  const container = document.createElement('div');
  container.innerHTML = template;
  return container.firstChild;
};

export {
  renderTemplate,
  RenderPosition,
  createElement,
  renderElement
};
