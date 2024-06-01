// App.jsx
import React, { useState, Suspense, lazy, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { Button } from './components';
import { fishing } from './utils';
import catImg from './assets/cat.png';
import textImg from './assets/text.png';
import bgBgm from './assets/bg-music.mp3';
import fishingBgm from './assets/fishing-bgm.mp3';

import './App.css';

function App() {
  const IsOpenInventory = lazy(() => import('./components/Inventory'));
  const IsOpenCollection = lazy(() => import('./components/Collection'));

  const [history, setHistory] = useState('아래 낚시하기 버튼을 통해 낚시를 시작 해보세요!');
  const [isFishing, setIsFishing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  const handleInventoryOpen = () => setIsInventoryOpen(true);
  const handleInventoryClose = () => setIsInventoryOpen(false);
  const handleCollectionOpen = () => setIsCollectionOpen(true);
  const handleCollectionClose = () => setIsCollectionOpen(false);

  const audio = new Audio(fishingBgm);

  const togglePlay = () => {
    audio.play();
  };

  const audioRef = useRef(new Audio(bgBgm));

  const isPlay = () => {
    const bgAudio = audioRef.current;

    if (bgAudio.paused) {
      bgAudio.play();
    } else {
      bgAudio.pause();
    }

    setIsPlaying(!isPlaying);
  };

  const handleFishing = () => {
    if (isFishing) return;

    setIsFishing(true);
    setHistory('낚시중...');
    setTimeout(() => {
      fishing(setHistory);
      togglePlay();
      setIsFishing(false);
    }, 1000); // 1초 대기 후 낚시 결과 표시
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
          <div className="relative flex flex-grow-[4] items-center justify-center bg-blue-100">
            <img
              className="absolute left-20 top-14 h-20 w-20 animate-bounce md:left-[120px] md:top-[96px] lg:left-32 lg:top-24"
              src={textImg}
              alt=""
            />
            <span className="absolute left-[94px] top-[84px] animate-bounce text-sm font-bold md:left-[134px] md:top-[124px] lg:left-[143px] lg:top-[123px]">
              낚시중...
            </span>
            <img className="h-36 w-36 animate-bounce" src={catImg} alt="" />
            <FontAwesomeIcon
              className="absolute bottom-3 right-3 text-blue-500 hover:cursor-pointer"
              icon={isPlaying ? faVolumeHigh : faVolumeXmark}
              onClick={isPlay}
            />
          </div>
          <div
            className={`max-h-[100px] flex-grow-[1] content-center rounded-b-md bg-white text-center font-medium text-blue-500 ${isFishing && 'font-extrabold'}`}
          >
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
