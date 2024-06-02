// IsOpenInventory.jsx
import fetchItems from '/src/utils/fetchItems';
import Modal from './Modal';
import { useEffect, useState } from 'react';

const IsOpenInventory = ({ isOpen, onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {};

    const fetchInventoryItems = async () => {
      const items = await Promise.all(
        Object.entries(inventory).map(async ([itemCode, quantity]) => {
          const name = await getItemInfo(itemCode);
          return { itemCode, name, quantity };
        })
      );
      setInventoryItems(items);
    };

    fetchInventoryItems();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-blue-500">
        <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
          인벤토리
        </h1>
        <div className="flex flex-row flex-nowrap border-b-[1px] border-b-slate-400 py-3 text-center">
          <span className="flex-1 font-semibold">아이템</span>
          <span className="flex-1 font-semibold">수량</span>
        </div>
        <ol className="my-3 flex flex-col flex-nowrap gap-3">
          {inventoryItems.map(({ itemCode, name, quantity }) => (
            <li className="flex flex-row flex-nowrap text-center" key={itemCode}>
              <span className="flex-1">{name}</span>
              <span className="flex-1 border-l-[1px] border-slate-400">{quantity}</span>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
};

// 아이템 코드를 기반으로 아이템 정보를 가져오는 함수
const getItemInfo = async (itemCode) => {
  let itemInfo = null;
  try {
    // 서버에서 데이터 가져오기
    const itemsData = await fetchItems();

    // 객체의 모든 값들을 하나의 배열로 만듭니다.
    const allItems = Object.values(itemsData).reduce((acc, val) => {
      // 배열이면 합치고, 아니면 그대로 반환 (예: _id 필드)
      if (Array.isArray(val)) {
        return acc.concat(val);
      }
      return acc;
    }, []);

    // allItems에서 itemCode에 맞는 아이템을 찾습니다.
    itemInfo = allItems.find((item) => item.code === itemCode);
    if (itemInfo) {
      return itemInfo.name;
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error fetching item:', error);
  }
};

export default IsOpenInventory;
