import React, { useState, useEffect } from 'react';

const ExperienceBar = ({ currentExp, setCurrentExp, level, setLevel }) => {
  const [maxExp, setMaxExp] = useState(100);

  useEffect(() => {
    // 레벨이 올라갈 때마다 maxExp를 10 증가시킵니다.
    setMaxExp(level * 10 + 90);
  }, [level]);

  useEffect(() => {
    // currentExp가 maxExp를 초과하면 레벨을 올리고 경험치를 0으로 설정합니다.
    if (currentExp >= maxExp) {
      setLevel(level + 1);
      setCurrentExp(0);
    }
  }, [currentExp, maxExp, setLevel, setCurrentExp]);

  const percentage = (currentExp / maxExp) * 100;

  return (
    <>
      <span className="absolute bottom-8 text-sm font-semibold text-blue-500">레벨: {level}</span>
      <div className="absolute bottom-3 h-4 w-48 max-w-48 rounded bg-white shadow-sm md:w-64 md:max-w-64">
        {' '}
        {/* w-64는 200px에 해당합니다. */}
        <div
          style={{ width: `${percentage}%` }}
          className="h-full max-w-48 rounded bg-blue-200 md:max-w-64"
        ></div>
      </div>
      <span className="absolute bottom-2.5 text-sm font-light text-blue-500">
        {currentExp}/{maxExp}
      </span>
    </>
  );
};

export default ExperienceBar;
