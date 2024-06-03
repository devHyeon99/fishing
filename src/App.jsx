import React, { useState, Suspense, lazy, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { Button } from './components';
import { fishing, fetchNotice } from './utils';
import useModal from './hooks/useModal';
import catImg from './assets/cat.png';
import textImg from './assets/text.png';
import bgBgm from './assets/bg-music.mp3';
import fishingBgm from './assets/fishing-bgm.mp3';

import './App.css';

const IsOpenInventory = lazy(() => import('./components/Inventory'));
const IsOpenCollection = lazy(() => import('./components/Collection'));

function App() {
  const [notice, setNotice] = useState('실시간 공지사항입니다.');
  const [history, setHistory] = useState('아래 낚시하기 버튼을 통해 낚시를 시작 해보세요!');
  const [isFishing, setIsFishing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const inventoryModal = useModal();
  const collectionModal = useModal();

  const audio = new Audio(fishingBgm);
  const audioRef = useRef(new Audio(bgBgm));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notice = await fetchNotice();
        setNotice(notice);
      } catch (error) {
        console.error('Error fetching items data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {};

    if (inventory['U01'] || inventory['R01']) {
      localStorage.setItem('inventory', JSON.stringify({}));
    }
  }, []);

  const togglePlay = () => {
    audio.play();
  };

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
            <span className="marquee-text">{notice}</span>
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
          <Button text="인벤토리" onClick={inventoryModal.openModal} />
          <Suspense>
            {inventoryModal.isOpen && (
              <IsOpenInventory isOpen={inventoryModal.isOpen} onClose={inventoryModal.closeModal} />
            )}
          </Suspense>
          <Button text="도감등록" onClick={collectionModal.openModal} />
          <Suspense>
            {collectionModal.isOpen && (
              <IsOpenCollection
                isOpen={collectionModal.isOpen}
                onClose={collectionModal.closeModal}
              />
            )}
          </Suspense>
        </div>
      </section>
    </>
  );
}

export default App;
