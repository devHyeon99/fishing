// IsOpenInventory.jsx
import itemsData from '../data/items.json';
import React from 'react';
import Modal from './Modal';

const IsOpenInventory = ({ isOpen, onClose }) => {
  const inventory = JSON.parse(localStorage.getItem('inventory')) || {};

  const inventoryItems = Object.entries(inventory).map(([itemCode, quantity]) => {
    const itemInfo = getItemInfo(itemCode);
    return (
      <li className="flex flex-row flex-nowrap text-center" key={itemCode}>
        <span className="flex-1">{itemInfo.name}</span>
        <span className="flex-1">{quantity}</span>
      </li>
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h1 className="border-b-[1px] border-gray-400 py-3 text-center font-bold">인벤토리</h1>
        <div className="mt-3 flex flex-row flex-nowrap text-center">
          <span className="flex-1">아이템</span>
          <span className="flex-1">수량</span>
        </div>
        <ol className="mt-3 flex flex-col flex-nowrap gap-3">{inventoryItems}</ol>
      </div>
    </Modal>
  );
};

// 아이템 코드를 기반으로 아이템 정보 가져오기.
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

export default IsOpenInventory;
