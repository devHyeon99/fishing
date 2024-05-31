import { useEffect, useState } from 'react';
import Modal from './Modal';
import setCollection from '../utils/setCollection';
import itemsData from '../data/items.json';

const IsOpenCollection = ({ isOpen, onClose }) => {
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem('inventory')) || {};
    setInventory(storedInventory);
  }, []);

  const handleSetCollection = (name, code) => {
    setInventory((prevInventory) => setCollection(prevInventory, name, code));
  };

  const collectionList = Object.values(itemsData)
    .flat()
    .map((item) => ({ name: item.name, code: item.code }))
    .map((item) => (
      <button
        key={item.code}
        className="h-20 w-20 rounded-md border border-solid border-slate-100 bg-blue-50 shadow-md hover:scale-105 active:scale-105"
        onClick={() => handleSetCollection(item.name, item.code)}
      >
        {item.name}
      </button>
    ));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
        도감등록
      </h1>
      <div className="grid grid-flow-row grid-cols-3 justify-evenly gap-x-10 gap-y-5 p-5">
        {collectionList}
      </div>
    </Modal>
  );
};

export default IsOpenCollection;
