// App.jsx
import React, { useState, Suspense, lazy } from 'react';
import { Button } from './components';
import { fishing } from './utils';
import './App.css';

function App() {
  const IsOpenInventory = lazy(() => import('./components/Inventory'));
  const IsOpenCollection = lazy(() => import('./components/Collection'));

  const [history, setHistory] = useState('아이템 획득 히스토리 부분');
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
          <div className="flex-grow-[4] rounded-t-md bg-blue-100"></div>
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
    </>
  );
}

export default App;
