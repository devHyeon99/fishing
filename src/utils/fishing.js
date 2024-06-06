import { fetchItems, setUserInventory, setUserExp } from '../utils';

const fishing = async (setHistory, currentExp, setCurrentExp, setInventory) => {
  const userIdx = JSON.parse(localStorage.getItem('userIdx'));

  try {
    const items = await fetchItems();
    if (!items) {
      throw new Error('Failed to fetch items');
    }

    const rand = Math.random() * 100;
    let selectedItem;
    let exp;
    let eventExp = 2;

    switch (true) {
      case rand < 0.1:
        selectedItem = items.chaos[Math.floor(Math.random() * items.chaos.length)];
        exp = currentExp + 100 * eventExp;
        setCurrentExp(exp);
        break;
      case rand < 1:
        selectedItem = items.legend[Math.floor(Math.random() * items.legend.length)];
        exp = currentExp + 50 * eventExp;
        setCurrentExp(exp);
        break;
      case rand < 6:
        selectedItem = items.unique[Math.floor(Math.random() * items.unique.length)];
        exp = currentExp + 25 * eventExp;
        setCurrentExp(exp);
        break;
      case rand < 16:
        selectedItem = items.rare[Math.floor(Math.random() * items.rare.length)];
        exp = currentExp + 10 * eventExp;
        setCurrentExp(exp);
        break;
      case rand < 50:
        selectedItem = items.normal[Math.floor(Math.random() * items.normal.length)];
        exp = currentExp + 5 * eventExp;
        setCurrentExp(exp);
        break;
      default:
        selectedItem = items.etc[Math.floor(Math.random() * items.etc.length)];
        exp = currentExp + 2 * eventExp;
        setCurrentExp(exp);
        break;
    }

    const item = {
      code: selectedItem.code,
      name: selectedItem.name,
    };

    // 서버에 인벤토리 저장
    setUserInventory(userIdx, item, 1);
    setUserExp(userIdx, exp);

    // 클라이언트에 인벤토리 저장
    setInventory((prev) => {
      const itemExists = prev.find((i) => i.code === item.code);

      if (itemExists) {
        // 아이템이 이미 존재하면 quantity를 증가
        return prev.map((i) => (i.code === item.code ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        // 아이템이 존재하지 않으면 새 아이템을 추가
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    setHistory(`${selectedItem.name}을(를) 획득하셨습니다.`);
  } catch (error) {
    console.error('Error fishing:', error);
    setHistory('아이템을 획득하는 중 오류가 발생했습니다.');
  }
};

export default fishing;
