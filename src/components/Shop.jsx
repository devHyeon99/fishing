import { useEffect, useState, useRef } from 'react';
import { fetchShop, fetchItems, setUserCoin, setUserInventory } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faCircleChevronLeft,
  faCircleChevronRight,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, AlertModal, ConfirmModal } from './index.js';
import useModal from '../hooks/useModal';

const Shop = ({ isOpen, onClose, coin, setCoin, userInventory, setInventory }) => {
  const [activeTab, setActiveTab] = useState('buy');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');
  const [contentModal, setcontentModal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const inputRef = useRef();

  const alertModal = useModal();
  const sellModal = useModal();
  const buyModal = useModal();
  const basicAlertModal = useModal();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentInventoryItems = inventoryItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentShopItems = shopItems.slice(indexOfFirstItem, indexOfLastItem);

  const inventoryTotalPages = Math.ceil(inventoryItems.length / itemsPerPage);
  const shopTotalPages = Math.ceil(shopItems.length / itemsPerPage);

  const userIdx = JSON.parse(localStorage.getItem('userIdx'));

  // input창 보일 시에 포커스 잡기 위함.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputQuantity]);

  useEffect(() => {
    // 상점 아이템 목록 가져오는 함수
    const fetchShopItems = async () => {
      const shopData = await fetchShop();
      const { equip, consumption } = shopData;
      const items = [...equip, ...consumption];
      setShopItems(items);
    };

    fetchShopItems();
  }, []);

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

  // 페이지 관리 함수
  const paginate = (pageNumber) => {
    if (activeTab === 'sell' && pageNumber >= 1 && pageNumber <= inventoryTotalPages) {
      setCurrentPage(pageNumber);
    } else if (activeTab === 'buy' && pageNumber >= 1 && pageNumber <= shopTotalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 아래로 모달 관련 제어 함수
  const sellConfirm = (quantity) => {
    setInputQuantity(quantity);
    sellModal.openModal();
  };

  const handleSellConfirm = () => {
    const itemInInventory = inventoryItems.find((item) => item.code === selectedItem.code);

    if (inputQuantity <= 0) {
      sellModal.closeModal();
      setcontentModal('0 이하의 값은 입력 할 수 없습니다.');
      basicAlertModal.openModal();
      return;
    }

    if (itemInInventory && itemInInventory.quantity >= inputQuantity) {
      itemInInventory.quantity -= inputQuantity;

      const totalPrice = coin + selectedItem.price * inputQuantity;
      setCoin(totalPrice);
      setUserCoin(userIdx, totalPrice);

      const updatedInventory = userInventory.map((item) =>
        item.code === selectedItem.code ? itemInInventory : item
      );
      setInventory(updatedInventory);

      setUserInventory(userIdx, itemInInventory, -inputQuantity);

      sellModal.closeModal();
      setcontentModal('아이템 판매를 완료 하였습니다.');
      basicAlertModal.openModal();
    } else {
      sellModal.closeModal();
      setcontentModal('보유량이 부족하거나 아이템을 판매 할 수 없습니다.');
      basicAlertModal.openModal();
    }
  };

  const buyConfirm = () => {
    buyModal.openModal();
  };

  const handleBuyConfirm = () => {
    buyModal.closeModal();
    setcontentModal('아직 상품을 구매 하실 수 없습니다.');
    basicAlertModal.openModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="relative min-h-[550px] text-blue-400">
          <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
            상점
          </h1>
          <div className="mt-4 flex h-7 justify-center gap-4">
            <button
              className={`rounded-md px-4 py-0 ${activeTab === 'buy' ? 'bg-blue-500 text-white' : 'border border-slate-300 bg-white text-blue-500'}`}
              onClick={() => {
                setActiveTab('buy');
                setCurrentPage(1);
              }}
            >
              구매
            </button>
            <button
              className={`rounded-md px-4 py-0 ${activeTab === 'sell' ? 'bg-blue-500 text-white' : 'border border-slate-300 bg-white text-blue-500'}`}
              onClick={() => {
                setActiveTab('sell');
                setCurrentPage(1);
              }}
            >
              판매
            </button>
          </div>
          {/* 아이템 구매 UI 렌더링 */}
          {activeTab === 'buy' && (
            <>
              <ol className="m-5 flex flex-col flex-nowrap gap-3">
                {currentShopItems.map(({ code, name, des, price }) => (
                  <li
                    className="flex flex-row flex-nowrap items-center rounded-md border border-slate-300 p-2 text-center shadow-md"
                    key={code}
                  >
                    <span className="flex-1 font-medium">{name}</span>
                    <span className="flex-1">
                      <FontAwesomeIcon className="mr-2 text-yellow-400" icon={faCoins} />
                      {price}
                    </span>
                    <button
                      type="button"
                      className="h-8 w-10 rounded-md border border-slate-300 text-sm text-red-500 shadow-md hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        setSelectedItem({ name, code, des });
                        buyConfirm();
                      }}
                    >
                      구매
                    </button>
                    <button
                      type="button"
                      className="ml-2 h-8 w-8 rounded-md border border-slate-300 text-blue-400 shadow-md hover:bg-blue-400 hover:text-white"
                      onClick={() => {
                        setSelectedItem({ name, code, des });
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
                    className={`text-2xl ${currentPage === shopTotalPages ? 'cursor-not-allowed text-gray-400' : 'text-blue-400'}`}
                    icon={faCircleChevronRight}
                  />
                </button>
              </footer>
            </>
          )}
          {/* 아이템 판매 UI 렌더링 */}
          {activeTab === 'sell' && (
            <>
              <ol className="m-5 flex flex-col flex-nowrap gap-3">
                {currentInventoryItems
                  .filter(({ quantity }) => quantity > 0)
                  .map(({ code, name, quantity, des, price }) => (
                    <li
                      className="flex flex-row flex-nowrap items-center rounded-md border border-slate-300 p-2 text-center shadow-md"
                      key={code}
                    >
                      <span className="flex-1">{name}</span>
                      <span className="flex-1">
                        <FontAwesomeIcon className="mr-2 text-yellow-400" icon={faCoins} />
                        {price}
                      </span>
                      <button
                        type="button"
                        className="h-8 w-10 rounded-md border border-slate-300 text-sm text-red-500 shadow-md hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          setSelectedItem({ name, code, quantity, des, price });
                          sellConfirm(quantity);
                        }}
                      >
                        판매
                      </button>
                      <button
                        type="button"
                        className="ml-2 h-8 w-8 rounded-md border border-slate-300 text-blue-400 shadow-md hover:bg-blue-400 hover:text-white"
                        onClick={() => {
                          setSelectedItem({ name, code, des });
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
                    className={`text-2xl ${currentPage === inventoryTotalPages ? 'cursor-not-allowed text-gray-400' : 'text-blue-400'}`}
                    icon={faCircleChevronRight}
                  />
                </button>
              </footer>
            </>
          )}
        </div>
      </Modal>

      {/* 아이템 구매 하는 Confirm 모달 */}
      <ConfirmModal
        isOpen={buyModal.isOpen}
        onClose={buyModal.closeModal}
        onConfirm={handleBuyConfirm}
      >
        <span className="block pt-4 text-center font-semibold">
          {selectedItem ? selectedItem.name : '아이템 이름이 표시되는 공간입니다.'}
        </span>
        <span className="block pt-4 text-center text-blue-500">
          해당 아이템을 구매하시겠습니까?
        </span>
      </ConfirmModal>

      {/* 아이템 판매 하는 Confirm 모달 */}
      <ConfirmModal
        isOpen={sellModal.isOpen}
        onClose={sellModal.closeModal}
        onConfirm={handleSellConfirm}
      >
        <span className="block py-2 pt-4 text-center font-semibold">
          {selectedItem ? selectedItem.name : '아이템 이름이 표시되는 공간입니다.'}
        </span>
        <span className="block pb-2 text-center font-light text-blue-500">
          현재 보유 개수 : {selectedItem.quantity}
        </span>
        <input
          type="number"
          ref={inputRef}
          name="quantity"
          value={inputQuantity}
          onChange={(e) => setInputQuantity(e.target.value)}
          className="mt-5 h-6 w-12 self-center rounded-sm border border-slate-300 text-center outline-none"
        />
        <span className="block pt-2 text-center text-blue-500">
          해당 아이템을 판매하시겠습니까?
        </span>
      </ConfirmModal>

      {/* 아이템 정보 확인하는 Alert 모달 */}
      <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">
          아이템 정보
        </h2>
        <span className="block pt-4 text-center font-semibold">
          {selectedItem ? selectedItem.name : '아이템 이름이 표시되는 공간입니다.'}
        </span>
        <span className="block py-4 text-center text-blue-500">
          {selectedItem ? selectedItem.des : '아이템 설명이 표시되는 공간입니다.'}
        </span>
      </AlertModal>

      {/* 확인 Alert 모달 */}
      <AlertModal isOpen={basicAlertModal.isOpen} onClose={basicAlertModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">알림</h2>
        <span className="block py-4 text-center text-blue-500">{contentModal}</span>
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
      return { name: itemInfo.name, des: itemInfo.des, price: itemInfo.price };
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error fetching item:', error);
  }
};

export default Shop;
