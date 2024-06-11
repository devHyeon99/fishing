import { useEffect, useState } from 'react';
import { Modal, AlertModal } from './index';
import { getEtcItems, setUserCollection, setUserInventory } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import useModal from '../hooks/useModal';

const IsOpenCollection = ({
  isOpen,
  onClose,
  userInventory,
  userCollection,
  setClientCol,
  setClientInven,
}) => {
  const [inventory, setInventory] = useState({});
  const [itemFullData, setItemFullData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [collection, setCollection] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentModal, setContentModal] = useState('');

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(itemsData.length / itemsPerPage);
  const currentItems = itemsData.slice(indexOfFirstItem, indexOfLastItem);

  const userIdx = JSON.parse(localStorage.getItem('userIdx'));

  const basicAlertModal = useModal();
  const itemInfoModal = useModal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEtcItems();
        const values = Object.values(data)
          .flatMap((value) => value)
          .filter((item) => typeof item === 'object');
        setItemsData(values);
        setItemFullData(data);
      } catch (error) {
        console.error('Error fetching items data:', error);
      }
    };

    setInventory(userInventory);
    setCollection(userCollection);
    fetchData();
  }, [userInventory, userCollection]);

  // 페이지 네이션 함수
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 수량 체크
  const checkItemQuantity = (item) => {
    if (!item || item.quantity < 10) {
      setContentModal(
        <>
          수량이 10개 미만이므로 등록할 수 없습니다.
          <br />({item ? item.quantity : 0}개 보유중)
        </>
      );
      basicAlertModal.openModal();
      return false;
    }
    return true;
  };

  // 클라이언트 메모리에 저장된 컬렉션 업데이트
  const updateCollection = (code, name) => {
    setClientCol((prevCollection) => {
      const newItem = { code, name };
      const updatedCollection = [...prevCollection, newItem];
      return updatedCollection;
    });
  };

  // 클라이언트 메모리에 저장된 인벤토리 업데이트
  const updateInventory = (code) => {
    setClientInven((prevInventory) => {
      const updatedInventory = prevInventory.map((invItem) => {
        if (invItem.code === code) {
          return { ...invItem, quantity: invItem.quantity - 10 };
        }
        return invItem;
      });
      return updatedInventory;
    });
  };

  // 도감 등록 이벤트 함수
  const onCollection = (code, name) => {
    const item = userInventory.find((item) => item.code === code);

    if (!checkItemQuantity(item)) {
      return;
    }

    // 서버측 데이터 처리
    setUserCollection(userIdx, code, name);
    setUserInventory(userIdx, item, -10);

    // 클라이언트 데이터 처리
    updateCollection(code, name);
    updateInventory(code);

    setContentModal(`${name}를(을) 도감에 등록 하였습니다.`);
    basicAlertModal.openModal();
  };

  // 버튼 렌더링
  const renderButton = (item) => {
    // inventory가 배열인지 확인
    if (!Array.isArray(inventory)) {
      return;
    }

    const isRegistered = collection.some((col) => col.name === item.name);
    const inventoryItem = inventory.find((inv) => inv.code === item.code);
    const isAvailable = inventoryItem && inventoryItem.quantity > 10;

    let statusText = '미등록';
    let statusColor = 'text-gray-300';
    let buttonProps = {
      className:
        'h-8 w-[74px] rounded-md border border-slate-300 font-medium text-blue-400 shadow-md hover:bg-blue-400 hover:text-white',
      onClick: () => onCollection(item.code, item.name),
      disabled: false,
    };

    if (isRegistered) {
      statusText = '등록됨';
      statusColor = 'text-red-400';
      buttonProps.className +=
        ' cursor-not-allowed text-gray-300 hover:bg-inherit hover:text-gray-300';
      buttonProps.disabled = true;
    } else if (isAvailable) {
      statusText = '등록가능';
      statusColor = 'text-blue-400';
    }

    return (
      <li
        className="flex flex-row flex-nowrap items-center rounded-md border border-slate-300 p-2 text-center shadow-md"
        key={item.code}
      >
        <span className="flex-1 font-medium text-blue-400">{item.name}</span>
        <span className={`flex-1 ${statusColor}`}>{statusText}</span>
        <button {...buttonProps}>등록</button>
      </li>
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h1 className="rounded-t-md bg-blue-400 py-4 text-center text-lg font-bold text-white">
          도감등록
        </h1>
        <button
          type="button"
          className="absolute left-5 top-5 rounded-sm bg-white px-1 py-0.5 text-xs font-semibold text-blue-400 shadow-md"
          onClick={itemInfoModal.openModal}
        >
          확률정보
        </button>
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
      <AlertModal isOpen={itemInfoModal.isOpen} onClose={itemInfoModal.closeModal}>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">
          아이템 확률 정보
        </h2>

        <div className="block max-h-[300px] items-center justify-center gap-y-3 overflow-y-auto py-3 font-medium text-blue-400">
          {itemFullData && itemFullData.chaos && (
            <span className="mb-3 flex flex-col text-center">
              카오스 0.1%
              <span>({itemFullData.chaos.map((item) => item.name).join(', ')})</span>
            </span>
          )}
          {itemFullData && itemFullData.legend && (
            <span className="mb-3 flex flex-col text-center">
              레전드 1%
              <br />({itemFullData.legend.map((item) => item.name).join(', ')})
            </span>
          )}
          {itemFullData && itemFullData.unique && (
            <span className="mb-3 flex flex-col text-center">
              유니크 5%
              <br />({itemFullData.unique.map((item) => item.name).join(', ')})
            </span>
          )}
          {itemFullData && itemFullData.epic && (
            <span className="mb-3 flex flex-col text-center">
              에픽 10%
              <br />({itemFullData.epic.map((item) => item.name).join(', ')})
            </span>
          )}
          {itemFullData && itemFullData.rare && (
            <span className="mb-3 flex flex-col text-center">
              레어 34%
              <br />({itemFullData.rare.map((item) => item.name).join(', ')})
            </span>
          )}
          {itemFullData && itemFullData.normal && (
            <span className="mb-3 flex flex-col text-center">
              노말 50%
              <br />({itemFullData.normal.map((item) => item.name).join(', ')})
            </span>
          )}
        </div>
      </AlertModal>
    </>
  );
};

export default IsOpenCollection;
