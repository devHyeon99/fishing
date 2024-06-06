const setCollection = (inventory, name, code, setContentModal, basicAlertModal) => {
  const updatedInventory = { ...inventory };

  if (updatedInventory[code] >= 10) {
    updatedInventory[code] = (updatedInventory[code] || 0) - 10;

    localStorage.setItem('inventory', JSON.stringify(updatedInventory));

    const collection = JSON.parse(localStorage.getItem('collection')) || {};
    collection[name] = (collection[name] || 0) + 1;
    localStorage.setItem('collection', JSON.stringify(collection));

    setContentModal('도감 등록이 완료되었습니다.');
    basicAlertModal.openModal();
  } else {
    setContentModal('현재 도감 시스템은 점검중입니다.');
    basicAlertModal.openModal();
  }

  return updatedInventory;
};

export default setCollection;
