// App.jsx
import React, { useState, Suspense, lazy } from 'react';
import { Button } from './components';
import { fishing } from './utils';
import './App.css';

function App() {
  const IsOpenInventory = lazy(() => import('./components/Inventory'));
  const IsOpenCollection = lazy(() => import('./components/Collection'));

  const [history, setHistory] = useState('아래 낚시하기 버튼을 통해 낚시를 시작 해보세요!');
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  const handleInventoryOpen = () => setIsInventoryOpen(true);
  const handleInventoryClose = () => setIsInventoryOpen(false);
  const handleCollectionOpen = () => setIsCollectionOpen(true);
  const handleCollectionClose = () => setIsCollectionOpen(false);

  const handleFishing = () => {
    fishing(setHistory);
  };

  return (
    <>
      <h1 className="mx-auto my-10 w-1/2 text-center text-3xl font-light text-blue-300">
        fishing game
      </h1>
      <section className="flex flex-col flex-nowrap gap-5">
        <div className="mx-auto flex h-[500px] w-[350px] flex-col rounded-lg shadow-base sm:h-[500px] sm:w-[400px] md:h-[600px] md:w-[450px]">
          <div className="text-semibold marquee-container flex h-10 flex-row flex-nowrap items-center justify-center rounded-t-md bg-blue-100 text-blue-500">
            <span className="marquee-text">
              <strong>김건호</strong>님이 처음으로 운석을 획득 하셨습니다. 축하 드립니다 🎉
            </span>
          </div>
          <div className="flex-grow-[4] bg-blue-100"></div>
          <div className="flex-grow-[1] content-center rounded-b-md bg-white text-center font-medium text-blue-500">
            {history}
          </div>
        </div>
        <div className="flex flex-row flex-nowrap justify-center gap-5">
          <Button text="낚시하기" onClick={handleFishing} />
          <Button text="인벤토리" onClick={handleInventoryOpen} />
          <Suspense>
            {isInventoryOpen && (
              <IsOpenInventory isOpen={isInventoryOpen} onClose={handleInventoryClose} />
            )}
          </Suspense>
          <Button text="도감등록" onClick={handleCollectionOpen} />
          <Suspense>
            {isCollectionOpen && (
              <IsOpenCollection isOpen={isCollectionOpen} onClose={handleCollectionClose} />
            )}
          </Suspense>
        </div>
      </section>
      );
    </>
  );
}

export default App;
