const updateArrayElement = (elements, updateElement) => {
  const updateElementIndex = elements.findIndex((item) => item.id === updateElement.id);

  if (updateElementIndex === -1) {
    return elements;
  }

  return [
    ...elements.slice(0, updateElementIndex),
    updateElement,
    ...elements.slice(updateElementIndex + 1)
  ];
};

export {updateArrayElement};
