// IsOpenInventory.jsx
import { getEtcItems, getConsumItems, giftBox } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faCircleChevronLeft,
  faCircleChevronRight,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, ConfirmModal, AlertModal } from './index.js';
import useModal from '../hooks/useModal';
import { useEffect, useState } from 'react';

const IsOpenInventory = ({ isOpen, onClose, userInventory }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [contentModal, setContentModal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const alertModal = useModal();
  const confirmModal = useModal();
  const basicAlertModal = useModal();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventoryItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inventoryItems.length / itemsPerPage);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      const items = await Promise.all(
        userInventory.map(async (item) => {
          const itemInfo = await getItemInfo(item.code);
          return { ...item, ...itemInfo };
        })
      );
      setInventoryItems(items);
    };
    fetchInventoryItems();
  }, [userInventory]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const showConfirm = (useable) => {
    if (useable) confirmModal.openModal();
    else {
      setContentModal('해당 아이템은 사용 할 수 없습니다.');
      basicAlertModal.openModal();
      return;
    }
  };

  const handleConfirm = () => {
    confirmModal.closeModal();
    setContentModal(giftBox(selectedItem.code));
    // setContentModal('아이템을 아직 사용 할 수 없습니다.');
    basicAlertModal.openModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="relative min-h-[500px] text-blue-400">
          <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
            인벤토리
          </h1>
          <ol className="m-5 flex flex-col flex-nowrap gap-3">
            {currentItems
              .filter(({ quantity }) => quantity > 0)
              .map(({ code, name, quantity, des, price, useable }) => (
                <li
                  className="flex flex-row flex-nowrap items-center rounded-md border border-slate-300 p-2 text-center shadow-md"
                  key={code}
                >
                  <span className="flex-1 font-medium">{name}</span>
                  <span className="flex-1">{quantity}</span>
                  <button
                    type="button"
                    className="h-8 w-10 rounded-md border border-slate-300 text-sm text-red-400 shadow-md hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      setSelectedItem({ code, name, quantity, useable });
                      showConfirm(useable);
                    }}
                  >
                    사용
                  </button>
                  <button
                    type="button"
                    className="ml-2 h-8 w-8 rounded-md border border-slate-300 text-blue-400 shadow-md hover:bg-blue-400 hover:text-white"
                    onClick={() => {
                      setSelectedItem({ name, des, price });
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
        <span className="block pt-5 text-center text-blue-400">
          해당 아이템을 사용 하시겠습니까?
        </span>
      </ConfirmModal>
      <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">
          아이템 정보
        </h2>
        <span className="block pt-5 text-center font-semibold">
          {selectedItem ? selectedItem.name : '아이템 이름이 표시되는 공간입니다.'}
        </span>
        <span className="block pt-3 text-center text-blue-500">
          <FontAwesomeIcon className="mr-2 text-yellow-400" icon={faCoins} />
          {selectedItem ? selectedItem.price : '아이템 가격이 표시되는 공간입니다.'}
        </span>
        <span className="block pb-5 pt-3 text-center text-blue-500">
          {selectedItem ? selectedItem.des : '아이템 설명이 표시되는 공간입니다.'}
        </span>
      </AlertModal>
      {/* 확인 Alert 모달 */}
      <AlertModal isOpen={basicAlertModal.isOpen} onClose={basicAlertModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">알림</h2>
        <span className="block py-4 text-center text-blue-400">{contentModal}</span>
      </AlertModal>
    </>
  );
};

// 아이템 코드를 기반으로 아이템 정보를 가져오는 함수
const getItemInfo = async (itemCode) => {
  let itemInfo = null;
  try {
    // 서버에서 데이터 가져오기
    const itemsData = await getEtcItems();
    const conItemsData = await getConsumItems();

    // itemsData와 conItemsData의 모든 값들을 하나의 배열로
    const allItems = [...Object.values(itemsData), ...Object.values(conItemsData)].reduce(
      (acc, val) => {
        if (Array.isArray(val)) {
          return acc.concat(val);
        }
        return acc;
      },
      []
    );

    // allItems에서 itemCode에 맞는 아이템을 찾습니다.
    itemInfo = allItems.find((item) => item.code === itemCode);
    if (itemInfo) {
      // 아이템 이름과 des 객체를 반환합니다.
      return {
        name: itemInfo.name,
        des: itemInfo.des,
        price: itemInfo.price,
        useable: itemInfo.useable,
      };
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error fetching item:', error);
  }
};

export default IsOpenInventory;
