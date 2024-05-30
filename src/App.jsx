// App.jsx
import React, { useState, Suspense, lazy } from 'react';
import Button from './components/Button.jsx';
import { fishing, isOpenCollection } from './utils';
import './App.css';

const IsOpenInventory = lazy(() => import('./components/inventory.jsx'));

function App() {
  const [history, setHistory] = useState('아이템 획득 히스토리 부분');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleFishing = () => {
    fishing(setHistory);
  };

  return (
    <>
      <h1 className="mx-auto my-10 w-1/2 text-center text-3xl font-bold">fishing game</h1>
      <section className="flex flex-col flex-nowrap gap-5">
        <div className="mx-auto flex h-[500px] w-[350px] flex-col rounded-md border border-solid border-gray-700 sm:h-[500px] sm:w-[400px] md:h-[600px] md:w-[450px]">
          <div className="flex-grow-[4] rounded-t-md"></div>
          <div className="flex-grow-[1] content-center rounded-b-md bg-gray-100 text-center">
            {history}
          </div>
        </div>
        <div className="flex flex-row flex-nowrap justify-center gap-5">
          <Button text="낚시하기" onClick={handleFishing} />
          <Button text="인벤토리" onClick={handleOpen} />
          <Suspense fallback={<div>Loading...</div>}>
            {isOpen && <IsOpenInventory isOpen={isOpen} onClose={handleClose} />}
          </Suspense>
          <Button text="도감등록" onClick={isOpenCollection} />
        </div>
      </section>
    </>
  );
}

export default App;
