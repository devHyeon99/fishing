import { useEffect, useState } from 'react';
import Modal from './Modal';
import setCollection from '../utils/setCollection';
import { fetchItems } from '../utils';

const IsOpenCollection = ({ isOpen, onClose }) => {
  const [inventory, setInventory] = useState({});
  const [itemsData, setItemsData] = useState([]);
  const storedInventory = JSON.parse(localStorage.getItem('inventory')) || {};

  useEffect(() => {
    setInventory(storedInventory);
    fetchData();
  }, []);

  const handleSetCollection = (name, code) => {
    setInventory((prevInventory) => setCollection(prevInventory, name, code));
  };

  const fetchData = async () => {
    try {
      const data = await fetchItems();
      const values = Object.values(data).flatMap((value) => value);
      setItemsData(values.slice(1));
    } catch (error) {
      console.error('Error fetching items data:', error);
    }
  };

  const renderButton = (item) => (
    <button
      key={item.code}
      className="h-20 w-20 rounded-md border border-solid border-slate-100 bg-blue-50 shadow-md hover:scale-105 active:scale-105"
      onClick={() => handleSetCollection(item.name, item.code)}
    >
      {item.name}
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
        도감등록
      </h1>
      <div className="grid grid-flow-row grid-cols-3 justify-evenly gap-x-10 gap-y-5 p-5">
        {itemsData.map(renderButton)}
      </div>
    </Modal>
  );
};

export default IsOpenCollection;
