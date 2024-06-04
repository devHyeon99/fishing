import fetchItems from './fetchItems';

const fishing = async (setHistory, currentExp, setCurrentExp) => {
  try {
    const items = await fetchItems();
    if (!items) {
      throw new Error('Failed to fetch items');
    }

    const rand = Math.random() * 100;
    let selectedItem;

    switch (true) {
      case rand < 0.1:
        selectedItem = items.chaos[Math.floor(Math.random() * items.chaos.length)];
        setCurrentExp(currentExp + 100);
        break;
      case rand < 1:
        selectedItem = items.legend[Math.floor(Math.random() * items.legend.length)];
        setCurrentExp(currentExp + 50);
        break;
      case rand < 6:
        selectedItem = items.unique[Math.floor(Math.random() * items.unique.length)];
        setCurrentExp(currentExp + 10);
        break;
      case rand < 16:
        selectedItem = items.rare[Math.floor(Math.random() * items.rare.length)];
        setCurrentExp(currentExp + 5);
        break;
      case rand < 50:
        selectedItem = items.normal[Math.floor(Math.random() * items.normal.length)];
        setCurrentExp(currentExp + 3);
        break;
      default:
        selectedItem = items.etc[Math.floor(Math.random() * items.etc.length)];
        setCurrentExp(currentExp + 1);
        break;
    }

    const itemCode = selectedItem.code;
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {};
    inventory[itemCode] = (inventory[itemCode] || 0) + 1;
    localStorage.setItem('inventory', JSON.stringify(inventory));

    setHistory(`${selectedItem.name}을(를) 획득하셨습니다.`);
  } catch (error) {
    console.error('Error fishing:', error);
    setHistory('아이템을 획득하는 중 오류가 발생했습니다.');
  }
};

export default fishing;
