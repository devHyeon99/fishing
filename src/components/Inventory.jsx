// IsOpenInventory.jsx
import fetchItems from '/src/utils/fetchItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faTrash,
  faCircleChevronLeft,
  faCircleChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, ConfirmModal, AlertModal } from './index.js';
import useModal from '../hooks/useModal';
import { useEffect, useState } from 'react';

const IsOpenInventory = ({ isOpen, onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const alertModal = useModal();
  const confirmModal = useModal();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventoryItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inventoryItems.length / itemsPerPage);

  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {};

    const fetchInventoryItems = async () => {
      const items = await Promise.all(
        Object.entries(inventory)
          .sort(([a], [b]) => {
            // 첫 글자를 기준으로 정렬하고, 첫 글자가 같으면 두 번째 글자를 기준으로 정렬
            const firstCharCompare = a[0].localeCompare(b[0]);
            return firstCharCompare !== 0 ? firstCharCompare : a.slice(1) - b.slice(1);
          })
          .map(async ([itemCode, quantity]) => {
            const { name, des } = await getItemInfo(itemCode);
            return { itemCode, name, des, quantity };
          })
      );
      setInventoryItems(items);
    };

    fetchInventoryItems();
  }, []);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const showConfirm = () => {
    confirmModal.openModal();
  };

  const handleConfirm = () => {
    confirmModal.closeModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="relative min-h-[500px] text-blue-500">
          <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
            인벤토리
          </h1>
          <ol className="m-5 flex flex-col flex-nowrap gap-3">
            {currentItems.map(({ itemCode, name, quantity, des }) => (
              <li
                className="flex flex-row flex-nowrap items-center rounded-md border border-slate-300 p-2 text-center shadow-md"
                key={itemCode}
              >
                <span className="flex-1">{name}</span>
                <span className="flex-1">{quantity}</span>
                <button
                  type="button"
                  className="h-8 w-8 rounded-md border border-slate-300 text-sm text-red-500 shadow-md hover:bg-red-500 hover:text-white"
                  onClick={showConfirm}
                >
                  <FontAwesomeIcon className="" icon={faTrash} />
                </button>
                <button
                  type="button"
                  className="ml-2 h-8 w-8 rounded-md border border-slate-300 text-blue-400 shadow-md hover:bg-blue-400 hover:text-white"
                  onClick={() => {
                    setSelectedItem({ name, des });
                    alertModal.openModal();
                  }}
                >
                  <FontAwesomeIcon className="" icon={faCircleInfo} />
                </button>
              </li>
            ))}
          </ol>
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
        </div>
      </Modal>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        onConfirm={handleConfirm}
      >
        <span className="block pt-5 text-center">해당 아이템을 삭제하시겠습니까?</span>
      </ConfirmModal>
      <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">
          아이템 정보
        </h2>
        <span className="block pt-5 text-center font-semibold">
          {selectedItem ? selectedItem.name : '아이템 이름이 표시되는 공간입니다.'}
        </span>
        <span className="block py-5 text-center text-blue-500">
          {selectedItem ? selectedItem.des : '아이템 설명이 표시되는 공간입니다.'}
        </span>
      </AlertModal>
    </>
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
      // 아이템 이름과 des 객체를 반환합니다.
      return { name: itemInfo.name, des: itemInfo.des };
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error fetching item:', error);
  }
};

export default IsOpenInventory;
