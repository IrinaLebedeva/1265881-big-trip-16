const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend'
};

const renderTemplate = (container, position, template) => {
  container.insertAdjacentElement(position, template);
};

export {renderTemplate, RenderPosition};
