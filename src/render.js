const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderTemplate = (container, position, template) => {
  container.insertAdjacentHTML(position, template);
};

export {renderTemplate, RenderPosition};
