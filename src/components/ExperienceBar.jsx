import React, { useState, useEffect } from 'react';
import { setUserLevel, setUserExp } from '../utils';

const ExperienceBar = ({ currentExp, setCurrentExp, level, setLevel }) => {
  const [maxExp, setMaxExp] = useState(100);
  const userIdx = JSON.parse(localStorage.getItem('userIdx'));

  useEffect(() => {
    setMaxExp(level * 10 + 90);
  }, [level]);

  useEffect(() => {
    if (currentExp >= maxExp) {
      setLevel((prevLevel) => prevLevel + 1);
      setCurrentExp(0);
    }
  }, [currentExp, maxExp, setLevel, setCurrentExp]);

  useEffect(() => {
    if (currentExp === 0) {
      setUserExp(userIdx, 0);
      setUserLevel(userIdx, level);
    }
  }, [level, currentExp]);

  // 경험치 바의 너비를 퍼센트로 계산합니다.
  const percentage = (currentExp / maxExp) * 100;

  return (
    <>
      <span className="absolute bottom-8 select-none text-sm font-light text-blue-500 ">
        Lv.{level}
      </span>
      <div className="absolute bottom-3 h-4 w-48 rounded-md bg-white">
        <div
          className="absolute h-4 rounded-md bg-blue-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="absolute bottom-3.5 h-4 select-none text-center text-sm font-light text-blue-500 ">
        {currentExp}/{maxExp}
      </span>
    </>
  );
};

export default ExperienceBar;
