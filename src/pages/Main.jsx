import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh, faStore, faCoins } from '@fortawesome/free-solid-svg-icons';
import { Button, ExperienceBar, Tooltip } from '../components';
import {
  fishing,
  fetchNotice,
  getEtcItems,
  fetchShop,
  getUserInventory,
  getUser,
  getUserCollection,
  getConsumItems,
} from '../utils';
import useModal from '../hooks/useModal';
import catImg from '../assets/cat.png';
import textImg from '../assets/text.png';
import bgBgm from '../assets/bg-music.mp3';
import fishingBgm from '../assets/fishing-bgm.mp3';

const IsOpenInventory = lazy(() => import('../components/Inventory'));
const IsOpenCollection = lazy(() => import('../components/Collection'));
const IsOpenShop = lazy(() => import('../components/Shop'));

function Main() {
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState('아래 낚시하기 버튼을 통해 낚시를 시작 해보세요!');
  const [coin, setCoin] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentExp, setCurrentExp] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [userInventory, setUserInventory] = useState([]);
  const [userCollection, setUserCollection] = useState([]);
  const [isFishing, setIsFishing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const noticeRef = useRef(null);
  const audio = new Audio(fishingBgm);
  const audioRef = useRef(new Audio(bgBgm));

  const inventoryModal = useModal();
  const collectionModal = useModal();
  const shopModal = useModal();

  useEffect(() => {
    const userIdx = JSON.parse(localStorage.getItem('userIdx'));
    if (!userIdx) {
      console.error('No user index found in localStorage');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [noticeData, inventoryData, userData, collectionData] = await Promise.all([
          fetchNotice(),
          getUserInventory(userIdx),
          getUser(userIdx),
          getUserCollection(userIdx),
        ]);

        setNotice(noticeData);
        setUserInventory(inventoryData);
        setUserCollection(collectionData);
        setUserInfo(userData);
        setCurrentExp(userData.exp);
        setCoin(userData.coin);
        setLevel(userData.level);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchShop();
    getEtcItems();
    getConsumItems();
  }, []);

  useEffect(() => {
    if (noticeRef.current) {
      noticeRef.current.style.animation = 'none';
      setTimeout(() => {
        noticeRef.current.style.animation = '';
      }, 10);
    }
  }, [notice]);

  const togglePlay = () => {
    audio.play();
  };

  const isPlay = () => {
    const bgAudio = audioRef.current;

    if (bgAudio.paused) {
      bgAudio.loop = true;
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
      fishing(setHistory, currentExp, setCurrentExp, setUserInventory);
      togglePlay();
      setIsFishing(false);
    }, 1500);
  };

  /* // 자동 낚시 코드 (임시 비활성화)
  const [fishingInterval, setFishingInterval] = useState(null);
  const currentExpRef = useRef(currentExp);

  useEffect(() => {
    currentExpRef.current = currentExp;
  }, [currentExp]);

  const handleFishing = () => {
    if (fishingInterval) {
      setHistory('낚시가 중단 되었습니다...');
      clearInterval(fishingInterval);
      setFishingInterval(null);
    } else {
      setHistory('잠시 후 낚시가 시작됩니다...');
      const interval = setInterval(() => {
        if (isFishing) return;

        setIsFishing(true);
        setHistory('낚시중...');
        setTimeout(async () => {
          await fishing(setHistory, currentExpRef.current, setCurrentExp, setUserInventory);
          togglePlay();
          await setIsFishing(false);
        }, 3000);
      }, 5000);
      setFishingInterval(interval);
    }
  }; */

  if (loading) {
    return (
      <>
        <div className="flex h-[100vh] flex-col items-center justify-center">
          <span className="block text-3xl font-light text-blue-400">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="mx-auto my-10 w-1/2 text-center text-3xl font-light text-blue-300">
        fishing game
      </h1>
      <section className="flex flex-col flex-nowrap gap-5">
        <div className="mx-auto flex h-[500px] w-[350px] flex-col rounded-lg shadow-base md:h-[600px] md:w-[450px]">
          <div className="text-semibold marquee-container flex h-10 flex-row flex-nowrap items-center justify-center rounded-t-md bg-blue-100 text-blue-500">
            <span className="marquee-text" ref={noticeRef}>
              {notice}
            </span>
          </div>
          <div className="relative flex flex-grow-[4] items-center justify-center bg-blue-100">
            <img
              className="absolute left-20 top-14 h-20 w-20 animate-bounce md:left-32 md:top-24"
              src={textImg}
              alt=""
            />
            <span className="absolute left-[94px] top-[84px] animate-bounce text-sm font-bold md:left-[143px] md:top-[123px]">
              낚시중...
            </span>
            <img className="h-36 w-36 animate-bounce" src={catImg} alt="" />
            <Tooltip
              message="보유 코인"
              style={{ position: 'absolute', left: 10, bottom: 8 }}
              position={{ x: -18, y: -50 }}
            >
              <FontAwesomeIcon className="select-none text-yellow-400" icon={faCoins} />
            </Tooltip>
            <span className="absolute bottom-[12px] left-8 select-none text-xs font-semibold text-blue-400 md:bottom-[10px] md:text-sm ">
              {coin}
            </span>
            <ExperienceBar
              currentExp={currentExp}
              level={level}
              setCurrentExp={setCurrentExp}
              setLevel={setLevel}
            ></ExperienceBar>
            <Tooltip
              message="상점"
              style={{ position: 'absolute', right: 40, bottom: 8 }}
              position={{ x: -6, y: -50 }}
            >
              <FontAwesomeIcon
                className="select-none text-blue-500 hover:cursor-pointer"
                onClick={shopModal.openModal}
                icon={faStore}
              />
            </Tooltip>
            <Suspense>
              {shopModal.isOpen && (
                <IsOpenShop
                  isOpen={shopModal.isOpen}
                  onClose={shopModal.closeModal}
                  coin={coin}
                  setCoin={setCoin}
                  userInventory={userInventory}
                  setInventory={setUserInventory}
                />
              )}
            </Suspense>
            <Tooltip
              message="배경음악"
              style={{ position: 'absolute', right: 10, bottom: 8 }}
              position={{ x: -20, y: -50 }}
            >
              <FontAwesomeIcon
                className="select-none text-blue-500 hover:cursor-pointer"
                icon={isPlaying ? faVolumeHigh : faVolumeXmark}
                onClick={isPlay}
              />
            </Tooltip>
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
              <IsOpenInventory
                isOpen={inventoryModal.isOpen}
                onClose={inventoryModal.closeModal}
                userInventory={userInventory}
              />
            )}
          </Suspense>
          <Button text="도감등록" onClick={collectionModal.openModal} />
          <Suspense>
            {collectionModal.isOpen && (
              <IsOpenCollection
                isOpen={collectionModal.isOpen}
                onClose={collectionModal.closeModal}
                userCollection={userCollection}
                userInventory={userInventory}
                setClientCol={setUserCollection}
                setClientInven={setUserInventory}
              />
            )}
          </Suspense>
        </div>
      </section>
    </>
  );
}

export default Main;
