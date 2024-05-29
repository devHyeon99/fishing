import itemsData from '../data/items.json';

const isOpenInventory = () => {
  const inventory = JSON.parse(localStorage.getItem('inventory')) || {};

  console.log('인벤토리 아이템');
  Object.entries(inventory).forEach(([itemCode, quantity]) => {
    const itemInfo = getItemInfo(itemCode);
    console.log(`아이템 이름: ${itemInfo.name}, 수량: ${quantity}`);
  });
};

// 아이템 코드를 기반으로 아이템 정보 가져오기
const getItemInfo = (itemCode) => {
  let itemInfo = null;
  Object.values(itemsData).forEach((itemCategory) => {
    itemCategory.forEach((item) => {
      if (item.code === itemCode) {
        itemInfo = item;
      }
    });
  });
  return itemInfo;
};

export default isOpenInventory;
