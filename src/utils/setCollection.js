const setCollection = (inventory, name, code) => {
  const updatedInventory = { ...inventory };

  if (updatedInventory[code] >= 10) {
    updatedInventory[code] = (updatedInventory[code] || 0) - 10;

    localStorage.setItem('inventory', JSON.stringify(updatedInventory));

    const collection = JSON.parse(localStorage.getItem('collection')) || {};
    collection[name] = (collection[name] || 0) + 1;
    localStorage.setItem('collection', JSON.stringify(collection));

    alert(`도감에 ${name}이(가) 등록되었습니다.`);
  } else {
    alert('도감을 채우기에 아이템 갯수가 모자릅니다.');
  }

  return updatedInventory;
};

export default setCollection;
