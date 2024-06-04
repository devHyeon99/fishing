import { useEffect, useState } from 'react';
import { Modal, AlertModal } from './index';
import setCollection from '../utils/setCollection';
import { fetchItems } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import useModal from '../hooks/useModal';

const IsOpenCollection = ({ isOpen, onClose }) => {
  const [inventory, setInventory] = useState({});
  const [itemsData, setItemsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentModal, setContentModal] = useState('');

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(itemsData.length / itemsPerPage);
  const currentItems = itemsData.slice(indexOfFirstItem, indexOfLastItem);

  const storedInventory = JSON.parse(localStorage.getItem('inventory')) || {};
  const storedCollection = JSON.parse(localStorage.getItem('collection')) || {};

  const basicAlertModal = useModal();

  useEffect(() => {
    setInventory(storedInventory);
    fetchData();
  }, []);

  const handleSetCollection = (name, code) => {
    setInventory((prevInventory) =>
      setCollection(prevInventory, name, code, setContentModal, basicAlertModal)
    );
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

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderButton = (item) => {
    const isRegistered = Object.prototype.hasOwnProperty.call(storedCollection, item.name);
    return (
      <li
        className="flex flex-row flex-nowrap items-center rounded-md border border-slate-300 p-2 text-center shadow-md"
        key={item.code}
      >
        <span className="flex-1 text-blue-400">{item.name}</span>
        <span className={`flex-1 font-semibold ${isRegistered ? 'text-red-400' : 'text-gray-300'}`}>
          {isRegistered ? '등록됨' : '미등록'}
        </span>
        <button
          className={`h-8 w-[74px] rounded-md border border-slate-300 font-semibold text-blue-400 shadow-md  ${isRegistered ? 'cursor-not-allowed text-gray-300' : 'hover:bg-blue-400 hover:text-white'}`}
          onClick={() => handleSetCollection(item.name, item.code)}
          disabled={isRegistered}
        >
          등록
        </button>
      </li>
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
          도감등록
        </h1>
        <ol className="m-5 flex flex-col flex-nowrap gap-3">{currentItems.map(renderButton)}</ol>
        <footer className="absolute bottom-0 left-[164px] mb-5 flex flex-row flex-nowrap items-center justify-center gap-6">
          <button type="button" onClick={() => paginate(currentPage - 1)}>
            <FontAwesomeIcon
              className={`text-2xl ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'text-blue-400'}`}
              icon={faCircleChevronLeft}
            />
          </button>
          <button type="button" onClick={() => paginate(currentPage + 1)}>
            <FontAwesomeIcon
              className={`text-2xl ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'text-blue-400'}`}
              icon={faCircleChevronRight}
            />
          </button>
        </footer>
      </Modal>
      {/* 확인 Alert 모달 */}
      <AlertModal isOpen={basicAlertModal.isOpen} onClose={basicAlertModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">알림</h2>
        <span className="block py-4 text-center text-blue-500">{contentModal}</span>
      </AlertModal>
    </>
  );
};

export default IsOpenCollection;
