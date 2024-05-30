import Modal from './Modal';
import itemsData from '../data/items.json';

const IsOpenCollection = ({ isOpen, onClose }) => {
  const inventory = JSON.parse(localStorage.getItem('inventory')) || {};

  const setCollection = (quantity) => {
    if (quantity >= 10) {
      alert('도감이 등록되었습니다.');
    } else {
      alert('아직 도감을 등록하기에 갯수가 적어요');
    }
  };

  const inventoryItems = Object.entries(inventory).map(([itemCode, quantity]) => {
    const itemInfo = getItemInfo(itemCode);
    return (
      <button
        key={itemCode}
        className="h-20 w-20 border border-solid border-slate-100 bg-slate-50 shadow-md"
        onClick={() => setCollection(quantity)}
      >
        {itemInfo.name}
      </button>
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className="mb-4 text-center font-bold">도감등록</h1>
      <div className="grid grid-flow-col grid-rows-5 justify-evenly gap-x-10 gap-y-5 border-t-[1px] border-slate-400 py-3">
        {inventoryItems}
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

export default IsOpenCollection;
